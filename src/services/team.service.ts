import { createClient } from '@/lib/supabase/client'
import { Team, Profile } from '@/types'

export const teamService = {
  async getTeams(): Promise<(Team & { members: Profile[] })[]> {
    const supabase = createClient()
    const { data: teams, error } = await supabase.from('teams').select('*').order('name')
    if (error) throw error

    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*')
    if (profilesError) throw profilesError

    return teams.map((team) => ({
      ...team,
      members: profiles.filter((p) => p.team_id === team.id),
    }))
  },

  async createTeam(name: string, createdBy: string): Promise<Team> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('teams')
      .insert({ name, created_by: createdBy })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteTeam(id: string): Promise<void> {
    const supabase = createClient()
    // Unassign members first so they don't dangle with a deleted team_id
    await supabase.from('profiles').update({ team_id: null, is_team_lead: false }).eq('team_id', id)
    const { error } = await supabase.from('teams').delete().eq('id', id)
    if (error) throw error
  },

  async assignMemberToTeam(userId: string, teamId: string | null): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ team_id: teamId }).eq('id', userId)
    if (error) throw error
  },

  async setTeamLead(userId: string, teamId: string, isLead: boolean): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ is_team_lead: isLead, team_id: teamId })
      .eq('id', userId)
    if (error) throw error
  },

  async removeFromTeam(userId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ team_id: null, is_team_lead: false })
      .eq('id', userId)
    if (error) throw error
  },
  async getTeamMembers(teamId: string): Promise<Profile[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from('profiles').select('*').eq('team_id', teamId)
    if (error) throw error
    return data
  },
}
