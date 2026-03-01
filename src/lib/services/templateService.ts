import { supabase } from '@/lib/supabase'
import { Template, TemplateWorkout } from '@/types'

export const templateService = {
  async list(userId: string): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*, workouts:template_workouts(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getActive(userId: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*, workouts:template_workouts(*, exercises:template_exercises(*, exercise:exercises(*)))')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error
    return data
  },

  async activate(templateId: string): Promise<Template> {
    const { error: deactivateError } = await supabase
      .from('templates')
      .update({ is_active: false })
      .eq('is_active', true)
      .select()

    if (deactivateError) throw deactivateError

    const { data, error } = await supabase
      .from('templates')
      .update({
        is_active: true,
        activated_at: new Date().toISOString(),
      })
      .eq('id', templateId)
      .select('*, workouts:template_workouts(*, exercises:template_exercises(*, exercise:exercises(*)))')
      .single()

    if (error) throw error
    return data
  },

  async resolveTodayWorkout(template: Template): Promise<TemplateWorkout | null> {
    if (!template.activated_at || !template.workouts) return null

    const activatedDate = new Date(template.activated_at)
    const today = new Date()

    const daysDiff = Math.floor(
      (today.getTime() - activatedDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    const cycleDay = (daysDiff % template.cycle_length) + 1

    const todayWorkout = template.workouts.find((w) => w.cycle_day === cycleDay)

    if (!todayWorkout) return null

    const { data, error } = await supabase
      .from('template_workouts')
      .select('*, exercises:template_exercises(*, exercise:exercises(*))')
      .eq('id', todayWorkout.id)
      .maybeSingle()

    if (error) throw error
    return data
  },
}
