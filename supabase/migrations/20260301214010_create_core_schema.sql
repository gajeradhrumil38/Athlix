/*
  # ATHLIX Core Database Schema

  ## Overview
  Creates the complete database schema for the ATHLIX fitness tracking application.

  ## Tables Created

  ### 1. exercises
  Stores exercise definitions (both built-in and user-created custom exercises)
  - `id` (uuid, primary key)
  - `name` (text) - Exercise name
  - `category` (text) - Category: strength, cardio, flexibility, etc.
  - `muscle_group` (text) - Primary muscle group targeted
  - `equipment` (text) - Required equipment
  - `is_custom` (boolean) - Whether user created this
  - `user_id` (uuid) - Foreign key to auth.users (null for built-in exercises)
  - `created_at` (timestamptz)

  ### 2. templates
  Stores workout templates with cycle-based programming
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Owner
  - `name` (text) - Template name
  - `description` (text) - Optional description
  - `cycle_length` (integer) - Number of days in cycle
  - `is_active` (boolean) - Whether template is currently active
  - `activated_at` (timestamptz) - When template was activated
  - `created_at` (timestamptz)

  ### 3. template_workouts
  Defines workouts within a template cycle
  - `id` (uuid, primary key)
  - `template_id` (uuid) - Foreign key to templates
  - `cycle_day` (integer) - Which day in the cycle (1-based)
  - `workout_name` (text) - Name of this workout
  - `created_at` (timestamptz)

  ### 4. template_exercises
  Defines exercises within a template workout
  - `id` (uuid, primary key)
  - `template_workout_id` (uuid) - Foreign key to template_workouts
  - `exercise_id` (uuid) - Foreign key to exercises
  - `order_index` (integer) - Order in workout
  - `target_sets` (integer) - Target number of sets
  - `target_reps` (integer) - Target reps (null if time-based)
  - `target_weight` (numeric) - Target weight in kg (null if bodyweight)
  - `rest_seconds` (integer) - Rest time between sets
  - `created_at` (timestamptz)

  ### 5. workout_sessions
  Tracks individual workout sessions (active and completed)
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Owner
  - `template_workout_id` (uuid) - Source template workout (nullable)
  - `workout_name` (text) - Session name
  - `status` (text) - active, completed, abandoned
  - `started_at` (timestamptz)
  - `completed_at` (timestamptz)
  - `total_duration_seconds` (integer) - Total workout time
  - `total_volume` (numeric) - Total weight * reps
  - `calories_burned` (integer) - Estimated calories
  - `notes` (text) - Optional session notes

  ### 6. workout_sets
  Individual sets performed in a session
  - `id` (uuid, primary key)
  - `session_id` (uuid) - Foreign key to workout_sessions
  - `exercise_id` (uuid) - Foreign key to exercises
  - `set_number` (integer) - Set number for this exercise
  - `reps` (integer) - Reps completed
  - `weight` (numeric) - Weight used in kg
  - `duration_seconds` (integer) - For time-based exercises
  - `completed_at` (timestamptz)

  ### 7. daily_stats
  Aggregated daily statistics
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Owner
  - `date` (date) - The date
  - `sessions_count` (integer)
  - `total_duration_seconds` (integer)
  - `total_volume` (numeric)
  - `calories_burned` (integer)
  - `exercises_completed` (integer)
  - `updated_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Built-in exercises (user_id = null) are readable by all authenticated users
  - All policies verify authentication via auth.uid()

  ## Indexes
  - Foreign key indexes for performance
  - Composite indexes on user_id + date for quick daily lookups
  - Index on template active status for current workout resolution
*/

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'strength',
  muscle_group text,
  equipment text,
  is_custom boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  cycle_length integer NOT NULL DEFAULT 7,
  is_active boolean DEFAULT false,
  activated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create template_workouts table
CREATE TABLE IF NOT EXISTS template_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE NOT NULL,
  cycle_day integer NOT NULL,
  workout_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create template_exercises table
CREATE TABLE IF NOT EXISTS template_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_workout_id uuid REFERENCES template_workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  target_sets integer DEFAULT 3,
  target_reps integer,
  target_weight numeric,
  rest_seconds integer DEFAULT 90,
  created_at timestamptz DEFAULT now()
);

-- Create workout_sessions table
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_workout_id uuid REFERENCES template_workouts(id) ON DELETE SET NULL,
  workout_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  total_duration_seconds integer DEFAULT 0,
  total_volume numeric DEFAULT 0,
  calories_burned integer DEFAULT 0,
  notes text
);

-- Create workout_sets table
CREATE TABLE IF NOT EXISTS workout_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES workout_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  set_number integer NOT NULL,
  reps integer DEFAULT 0,
  weight numeric DEFAULT 0,
  duration_seconds integer DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

-- Create daily_stats table
CREATE TABLE IF NOT EXISTS daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  sessions_count integer DEFAULT 0,
  total_duration_seconds integer DEFAULT 0,
  total_volume numeric DEFAULT 0,
  calories_burned integer DEFAULT 0,
  exercises_completed integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_active ON templates(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_template_workouts_template ON template_workouts(template_id);
CREATE INDEX IF NOT EXISTS idx_template_exercises_workout ON template_exercises(template_workout_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_status ON workout_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON workout_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sets_session ON workout_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date DESC);

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercises
CREATE POLICY "Users can view built-in exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can create custom exercises"
  ON exercises FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_custom = true);

CREATE POLICY "Users can update own custom exercises"
  ON exercises FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_custom = true)
  WITH CHECK (auth.uid() = user_id AND is_custom = true);

CREATE POLICY "Users can delete own custom exercises"
  ON exercises FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND is_custom = true);

-- RLS Policies for templates
CREATE POLICY "Users can view own templates"
  ON templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own templates"
  ON templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for template_workouts
CREATE POLICY "Users can view own template workouts"
  ON template_workouts FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM templates WHERE templates.id = template_workouts.template_id AND templates.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own template workouts"
  ON template_workouts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM templates WHERE templates.id = template_workouts.template_id AND templates.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own template workouts"
  ON template_workouts FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM templates WHERE templates.id = template_workouts.template_id AND templates.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM templates WHERE templates.id = template_workouts.template_id AND templates.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own template workouts"
  ON template_workouts FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM templates WHERE templates.id = template_workouts.template_id AND templates.user_id = auth.uid()
  ));

-- RLS Policies for template_exercises
CREATE POLICY "Users can view own template exercises"
  ON template_exercises FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM template_workouts tw
    JOIN templates t ON t.id = tw.template_id
    WHERE tw.id = template_exercises.template_workout_id AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own template exercises"
  ON template_exercises FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM template_workouts tw
    JOIN templates t ON t.id = tw.template_id
    WHERE tw.id = template_exercises.template_workout_id AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own template exercises"
  ON template_exercises FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM template_workouts tw
    JOIN templates t ON t.id = tw.template_id
    WHERE tw.id = template_exercises.template_workout_id AND t.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM template_workouts tw
    JOIN templates t ON t.id = tw.template_id
    WHERE tw.id = template_exercises.template_workout_id AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own template exercises"
  ON template_exercises FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM template_workouts tw
    JOIN templates t ON t.id = tw.template_id
    WHERE tw.id = template_exercises.template_workout_id AND t.user_id = auth.uid()
  ));

-- RLS Policies for workout_sessions
CREATE POLICY "Users can view own sessions"
  ON workout_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON workout_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON workout_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON workout_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for workout_sets
CREATE POLICY "Users can view own sets"
  ON workout_sets FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM workout_sessions WHERE workout_sessions.id = workout_sets.session_id AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own sets"
  ON workout_sets FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM workout_sessions WHERE workout_sessions.id = workout_sets.session_id AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own sets"
  ON workout_sets FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM workout_sessions WHERE workout_sessions.id = workout_sets.session_id AND workout_sessions.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM workout_sessions WHERE workout_sessions.id = workout_sets.session_id AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own sets"
  ON workout_sets FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM workout_sessions WHERE workout_sessions.id = workout_sets.session_id AND workout_sessions.user_id = auth.uid()
  ));

-- RLS Policies for daily_stats
CREATE POLICY "Users can view own stats"
  ON daily_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own stats"
  ON daily_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON daily_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stats"
  ON daily_stats FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
