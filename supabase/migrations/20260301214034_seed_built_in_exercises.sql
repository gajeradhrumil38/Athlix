/*
  # Seed Built-in Exercises

  ## Overview
  Populates the exercises table with common built-in exercises across multiple categories.

  ## Categories
  - Strength exercises (chest, back, legs, shoulders, arms, core)
  - Cardio exercises
  - Flexibility exercises

  ## Notes
  - All seeded exercises have user_id = NULL (built-in)
  - is_custom = false for all built-in exercises
  - Uses IF NOT EXISTS pattern to allow safe re-runs
*/

-- Insert built-in exercises (only if they don't already exist)
DO $$
BEGIN
  -- Chest exercises
  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Bench Press' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Bench Press', 'strength', 'chest', 'barbell', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Incline Dumbbell Press' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Incline Dumbbell Press', 'strength', 'chest', 'dumbbells', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Push-ups' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Push-ups', 'strength', 'chest', 'bodyweight', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Cable Flyes' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Cable Flyes', 'strength', 'chest', 'cable', false, NULL);
  END IF;

  -- Back exercises
  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Deadlift' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Deadlift', 'strength', 'back', 'barbell', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Pull-ups' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Pull-ups', 'strength', 'back', 'bodyweight', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Barbell Row' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Barbell Row', 'strength', 'back', 'barbell', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Lat Pulldown' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Lat Pulldown', 'strength', 'back', 'cable', false, NULL);
  END IF;

  -- Leg exercises
  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Squat' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Squat', 'strength', 'legs', 'barbell', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Leg Press' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Leg Press', 'strength', 'legs', 'machine', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Lunges' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Lunges', 'strength', 'legs', 'dumbbells', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Romanian Deadlift' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Romanian Deadlift', 'strength', 'legs', 'barbell', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Leg Curl' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Leg Curl', 'strength', 'legs', 'machine', false, NULL);
  END IF;

  -- Shoulder exercises
  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Overhead Press' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Overhead Press', 'strength', 'shoulders', 'barbell', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Lateral Raises' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Lateral Raises', 'strength', 'shoulders', 'dumbbells', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Face Pulls' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Face Pulls', 'strength', 'shoulders', 'cable', false, NULL);
  END IF;

  -- Arm exercises
  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Barbell Curl' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Barbell Curl', 'strength', 'arms', 'barbell', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Tricep Dips' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Tricep Dips', 'strength', 'arms', 'bodyweight', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Hammer Curls' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Hammer Curls', 'strength', 'arms', 'dumbbells', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Tricep Pushdown' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Tricep Pushdown', 'strength', 'arms', 'cable', false, NULL);
  END IF;

  -- Core exercises
  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Plank' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Plank', 'strength', 'core', 'bodyweight', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Hanging Leg Raises' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Hanging Leg Raises', 'strength', 'core', 'bodyweight', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Cable Crunches' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Cable Crunches', 'strength', 'core', 'cable', false, NULL);
  END IF;

  -- Cardio exercises
  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Running' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Running', 'cardio', 'full body', 'none', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Cycling' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Cycling', 'cardio', 'legs', 'bike', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Rowing Machine' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Rowing Machine', 'cardio', 'full body', 'machine', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Jump Rope' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Jump Rope', 'cardio', 'full body', 'jump rope', false, NULL);
  END IF;

  -- Flexibility exercises
  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Static Stretching' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Static Stretching', 'flexibility', 'full body', 'none', false, NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Yoga Flow' AND user_id IS NULL) THEN
    INSERT INTO exercises (name, category, muscle_group, equipment, is_custom, user_id)
    VALUES ('Yoga Flow', 'flexibility', 'full body', 'mat', false, NULL);
  END IF;
END $$;
