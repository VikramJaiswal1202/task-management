'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, ProfileFormInput } from '@/lib/validations/profile'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useUpdateProfile } from '@/hooks/use-users'
import { storageService } from '@/services/storage.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ChangePasswordForm } from '@/components/features/settings/change-password-form'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'

const timezones = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Kolkata', 'Asia/Dubai',
  'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
]

export default function SettingsPage() {
  const { data: currentUser, isLoading } = useCurrentUser()
  const updateProfile = useUpdateProfile()
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    values: currentUser
      ? {
          fullName: currentUser.profile.full_name ?? '',
          department: currentUser.profile.department ?? '',
          phone: currentUser.profile.phone ?? '',
          timezone: currentUser.profile.timezone ?? 'UTC',
        }
      : undefined,
  })

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }

    setUploading(true)
    try {
      const url = await storageService.uploadAvatar(file, currentUser.id)
      await updateProfile.mutateAsync({ id: currentUser.id, updates: { avatar_url: url } })
    } catch {
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = (data: ProfileFormInput) => {
    if (!currentUser) return
    updateProfile.mutate({
      id: currentUser.id,
      updates: {
        full_name: data.fullName,
        department: data.department,
        phone: data.phone,
        timezone: data.timezone,
      },
    })
  }

  if (isLoading || !currentUser) return <p className="text-muted-foreground">Loading...</p>

  const initials = currentUser.profile.full_name
    ? currentUser.profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser.email[0].toUpperCase()

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account preferences</p>
      </div>

      <div className="rounded-lg border bg-background p-6">
        <h2 className="mb-4 font-medium">Profile</h2>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser.profile.avatar_url ?? undefined} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Camera className="h-3.5 w-3.5" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
            </label>
          </div>
          <div>
            <p className="font-medium">{currentUser.profile.full_name}</p>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register('fullName')} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="e.g. Engineering" {...register('department')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 234 567 8900" {...register('phone')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select
              defaultValue={currentUser.profile.timezone ?? 'UTC'}
              onValueChange={(val) => setValue('timezone', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>

      <Separator />

      <ChangePasswordForm />
    </div>
  )
}