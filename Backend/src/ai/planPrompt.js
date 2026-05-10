const buildPlanPrompt = (data) => {

// ✅ Derive goal server-side as fallback (never rely on data.goal being correct)
const derivedGoal =
  Number(data.current_weight) < Number(data.target_weight) ? "Weight Gain" :
  Number(data.current_weight) > Number(data.target_weight) ? "Fat Loss" :
  "Maintenance"

const goal = data.goal || derivedGoal

return `

You are a professional fitness trainer and certified dietician.

Create EXACTLY ${data.number_of_weeks} weeks fitness plan.

NEVER stop early.
NEVER create extra weeks.
NEVER remove weeks.

Each week MUST contain:

1) Diet Table (7 days)
2) Workout Table (7 days)
3) Health Tips Table

=================================
USER PROFILE
=================================

Name             = ${data.name || 'User'}
Age              = ${data.age} years
Gender           = ${data.gender}
Current Weight   = ${data.current_weight} kg
Target Weight    = ${data.target_weight} kg
Goal             = ${goal}
Diet Preference  = ${data.diet_type}

=================================
INPUT VALIDATION (MANDATORY)
=================================

Run BEFORE generating tables. Print warnings ONLY if a rule genuinely fails.
If NO warnings → skip this block entirely, do NOT print anything.

Rule 1 — Goal vs weight direction:

  Current = ${data.current_weight}kg, Target = ${data.target_weight}kg
  Derived goal = ${derivedGoal}

  ONLY warn if stated goal directly contradicts weight direction:
  - Goal is "Fat Loss" BUT current_weight < target_weight → ⚠ WARNING: You want to lose weight but current (${data.current_weight}kg) is already below target (${data.target_weight}kg). Check your targets.
  - Goal is "Weight Gain" BUT current_weight > target_weight → ⚠ WARNING: You want to gain weight but current (${data.current_weight}kg) already exceeds target (${data.target_weight}kg). Check your targets.
  - In ALL other cases → NO WARNING. Do not print anything for this rule.

Rule 2 — Protein sanity:

  Current protein = ${data.protein}g
  Only warn if BOTH conditions are true:
    - protein × 4 > ${data.dailyCalories} × 0.50 (more than 50% of calories from protein)
    AND
    - protein > ${data.current_weight} × 2.5 (exceeds even aggressive targets)
  If triggered → ⚠ WARNING: Protein (${data.protein}g) is extremely high. Consider reducing slightly.
  Otherwise → NO WARNING. Do not print anything for this rule.

Rule 3 — Diet type:

  Valid values: Vegetarian / Non-Vegetarian / Keto
  Only warn if diet_type is empty or completely unrecognised.
  "${data.diet_type}" → if this matches any valid value (case-insensitive) → NO WARNING.

Rule 4 — Week count:

  Only warn if number_of_weeks < 1 or > 52.
  ${data.number_of_weeks} weeks → if valid → NO WARNING.

IMPORTANT: Print warnings ONLY for rules that genuinely fail.
If all inputs are valid → print NOTHING before Week 1. Jump straight to tables.

=================================
AGE-BASED WORKOUT RULES (STRICT)
=================================

User age = ${data.age}

If age < 18 (Teen):
  - NO heavy barbell lifts
  - Bodyweight + light dumbbells only
  - Maximum intensity = Moderate-High (NEVER High)
  - Focus: movement quality, mobility, endurance
  - Minimum 2 Rest days per week

If age 18–35 (Young Adult):
  - Full intensity range allowed
  - Progressive overload each week

If age 36–50 (Adult):
  - High intensity maximum 1 day per week
  - At least 1 Mobility day per week
  - Joint-friendly alternatives (goblet squat, etc.)
  - Warm-up MUST be listed (10 min minimum)

If age 51–60 (Mature Adult):
  - Maximum intensity = Moderate-High (max 2 days/week)
  - NO High intensity
  - Prefer resistance bands and machines
  - Minimum 2 Recovery or Rest days per week

If age > 60 (Senior):
  - Maximum intensity = Moderate
  - Chair-supported exercises allowed
  - Minimum 2 Rest + 2 Recovery days per week
  - Focus: balance, flexibility, walking, light resistance

=================================
GENDER-BASED DIET RULES
=================================

User gender = ${data.gender}

If Male:
  - Protein: 1.8–2.2g per kg body weight
  - Higher calorie surplus acceptable (+300–500 kcal)
  - Zinc-rich foods recommended

If Female:
  - Protein: 1.4–1.8g per kg body weight
  - Calorie deficit MUST NOT exceed 300 kcal/day
  - MANDATORY: 1 iron-rich food per day (spinach, lentils, tofu)
  - MANDATORY: 1 calcium-rich food per day (dairy, almonds, broccoli)
  - Avoid extreme low-fat meals

If Other:
  - Moderate protein: 1.6g per kg body weight
  - Balanced neutral macro split

=================================
GENDER-BASED WORKOUT RULES
=================================

User gender = ${data.gender}

If Male:
  - Emphasise upper body compound lifts
  - Strength days: 4–6 reps, heavy load
  - Hypertrophy days: 8–12 reps

If Female:
  - Emphasise lower body + glute focus
  - Preferred rep range: 12–15 reps
  - Include 1 core/flexibility session per week

If Other:
  - Full-body balanced approach

=================================
DIET RULES (VERY STRICT)
=================================

Daily Calories Target = ${data.dailyCalories}
Daily Protein Target  = ${data.protein}g

Meal distribution:

Breakfast = ${data.breakfastCalories} kcal
Lunch     = ${data.lunchCalories} kcal
Snack     = ${data.snackCalories} kcal
Dinner    = ${data.dinnerCalories} kcal

---------------------------------
DIET TYPE (CRITICAL)
---------------------------------

Diet = ${data.diet_type}

If Vegetarian:
  - NO chicken, egg, fish, seafood, mutton, bacon
  - Allowed: paneer, tofu, soy chunks, dal, chickpeas, rajma, sprouts, nuts, dairy

If Non-Vegetarian:
  - chicken / egg / fish allowed
  - avoid red meat unless goal is Muscle Gain

If Keto:
  - low carb, high fat meals

Violation = INVALID PLAN.

---------------------------------
DIET TABLE FORMAT
---------------------------------

Day | Breakfast | Lunch | Snack | Dinner | Calories/Day | Protein/Day

- Calories/Day and Protein/Day: COMPULSORY, LAST TWO columns
- Each meal: food name (XXX kcal, XXg protein)
- Daily totals MUST match targets

=================================
WORKOUT RULES
=================================

Each week MUST include ALL intensities:
Low / Low-Moderate / Moderate / Moderate-High / High* / Recovery / Rest
(*subject to age rules)

Progression: Low → Low-Moderate → Moderate → Moderate-High → High

---------------------------------
EXERCISE TYPE ROTATION (internal use only)
---------------------------------

Use these to vary exercises across weeks.
NEVER print type labels in the table.
Write exercise names ONLY.

If goal = Weight Gain or Muscle Gain:
  Week type A: bench press, OHP, barbell rows, lat pulldown, curls (Male)
               hip thrusts, Romanian deadlift, lunges, cable kickbacks (Female)
  Week type B: deadlift, squat, weighted pull-ups, farmer carries (Male)
               sumo deadlift, goblet squat, hip thrust, cable row (Female)
  Week type C: kettlebell swings, battle ropes, box jumps, burpees

If goal = Fat Loss:
  Rotate: running / cycling / jump rope / HIIT circuits / bodyweight circuits

If goal = Maintenance:
  Rotate: full-body compound / cardio / mobility / circuits

Rules:
- NEVER repeat same exercise pattern 2 weeks in a row
- NEVER start week with High intensity
- Do NOT skip High in later weeks (unless age restricts)

---------------------------------
WORKOUT TABLE FORMAT
---------------------------------

Day | Exercise | Intensity | Duration | Timing

- Exercise column: names only, no labels, no prefixes
- Example: "Squats, Lunges, Leg Press" ✅
- NEVER: "Hypertrophy — Squats" ❌

=================================
HEALTH TIPS
=================================

Format:
Tip No | Tip Description | Benefit

- EXACTLY 5 tips per week
- Scientific, practical, 1 line each
- Different every week
- Personalised for: ${goal} + age ${data.age} + ${data.gender}

=================================
OUTPUT FORMAT
=================================

[warnings only if rules genuinely failed — otherwise nothing here]

Week 1 Diet Table
Week 1 Workout Table
Week 1 Health Tips Table

Week 2 Diet Table
...

Continue until Week ${data.number_of_weeks}.

Markdown tables ONLY. No extra text.

`

}

module.exports = { buildPlanPrompt }