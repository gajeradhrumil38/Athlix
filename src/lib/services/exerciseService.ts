import { supabase } from '@/lib/supabase'
import { Exercise } from '@/types'

export const exerciseService = {
  async list(userId: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  async search(query: string, userId: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  async addCustom(
    userId: string,
    name: string,
    category: 'strength' | 'cardio' | 'flexibility',
    muscleGroup?: string,
    equipment?: string
  ): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .insert({
        user_id: userId,
        name,
        category,
        muscle_group: muscleGroup || null,
        equipment: equipment || null,
        is_custom: true,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getById(exerciseId: string): Promise<Exercise | null> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', exerciseId)
      .maybeSingle()

    if (error) throw error
    return data
  },
}
