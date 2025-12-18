# Food Synergy Scoring Algorithm

## Overview

This algorithm recommends additional foods based on how well they pair with foods the user has already selected. It uses a simple additive scoring model that considers synergies, conflicts, and timing constraints.

## Scoring Approach

### 1. Base Synergy Score

For each candidate food, calculate its total synergy score by summing all pairwise synergy values with already-selected foods:

```
total_synergy(candidate) = Σ synergy(candidate, selected_food) for all selected_food
```

Where:
- `synergy(food_a, food_b)` returns a numeric score (can be positive, negative, or zero)
- Positive scores indicate beneficial combinations (nutritional synergies, flavor pairing)
- Negative scores indicate conflicts (nutrient competition, poor flavor pairing)
- Zero indicates neutral/no known interaction

### 2. Normalization (Optional for MVP)

For MVP, we use raw scores. Future versions could normalize by:
- Number of selected foods (average synergy)
- Food category weights
- User preference multipliers

### 3. Timing Constraints

Foods are tagged with meal types (breakfast, lunch, dinner, snack, any). Suggestions are filtered to match the requested meal context:

```
if meal_context specified:
  candidate must have meal_context in allowed_meal_types
```

### 4. Ranking and Filtering

**Step 1: Filter**
- Remove already-selected foods
- Apply timing constraints (if specified)
- Optionally filter by dietary restrictions, categories, etc.

**Step 2: Score**
- Calculate total synergy for each remaining candidate

**Step 3: Rank**
- Sort candidates by total synergy score (descending)
- Return top N results

**Step 4: Threshold (Optional)**
- Optionally filter out candidates below a minimum score threshold
- For MVP: show all ranked results, let user decide

## Example Calculation

### Scenario
User selects:
- Spinach
- Blueberries

Candidate food: **Walnuts**

### Synergy Data
```
synergy(walnuts, spinach) = +5
  Reason: Omega-3s enhance iron absorption from leafy greens

synergy(walnuts, blueberries) = +3
  Reason: Healthy fats help absorb antioxidants from berries
```

### Calculation
```
total_synergy(walnuts) = synergy(walnuts, spinach) + synergy(walnuts, blueberries)
                       = 5 + 3
                       = 8
```

### Full Example with Multiple Candidates

**Selected Foods:**
- Spinach
- Blueberries
- Oatmeal

**Candidates with Scores:**

| Candidate | Synergy w/ Spinach | Synergy w/ Blueberries | Synergy w/ Oatmeal | Total Score |
|-----------|-------------------|------------------------|-------------------|-------------|
| Walnuts | +5 | +3 | +4 | **12** |
| Orange | +6 | +2 | +1 | **9** |
| Coffee | -2 | +0 | -3 | **-5** |
| Eggs | +4 | +1 | +2 | **7** |

**Ranked Suggestions:**
1. Walnuts (12)
2. Orange (9)
3. Eggs (7)
4. Coffee (-5) - shown but clearly not recommended

## Edge Cases to Handle

### 1. No Selected Foods
**Scenario:** User hasn't selected anything yet

**Solution:**
- Return popular "starter" foods
- Or foods with highest average synergy across all foods
- Or return empty/message prompting user to select foods first

### 2. All Candidates Have Negative Scores
**Scenario:** Selected foods conflict with most available foods

**Solution:**
- Still show ranked list (least negative first)
- Add warning indicator for negative scores
- Suggest reconsidering selected foods

### 3. Missing Synergy Data
**Scenario:** No synergy relationship defined between candidate and selected food

**Solution:**
- Treat missing data as zero (neutral)
- This allows new foods to be suggested even if we don't have full synergy data

### 4. Circular/Self-Synergy
**Scenario:** What if there's a synergy(food_a, food_a) entry?

**Solution:**
- Filter candidates to exclude already-selected foods before scoring
- Self-synergy data should be ignored/removed from dataset

### 5. Asymmetric Synergies
**Scenario:** Is synergy(a, b) always equal to synergy(b, a)?

**Assumption for MVP:**
- Yes, synergies are symmetric
- Data model should enforce single entry per pair
- Access pattern: always sort food IDs and lookup (food_1, food_2) where food_1 < food_2

### 6. Timing Constraint with No Matches
**Scenario:** No foods match the requested meal type

**Solution:**
- Return empty results with helpful message
- Or fall back to "any" meal type foods
- Or suggest meal types that have available foods

### 7. Very Large Selected Food Set
**Scenario:** User selects 50+ foods, scoring becomes slow

**Solution for MVP:**
- Acceptable for MVP with small food database
- Future: Pre-compute top synergies, use caching, optimize data structures

## Algorithm Complexity

For MVP with simple implementation:
- **Time:** O(C × S) where C = candidates, S = selected foods
- **Space:** O(C) for storing scores

This is acceptable for:
- ~100-500 total foods in database
- ~5-20 selected foods per user
- No real-time constraints (suggestions can take 100-500ms)

## Future Improvements Beyond MVP

### 1. Weighted Synergies
Different types of synergies have different importance:
```
total_synergy = w1 × nutritional_synergy + w2 × flavor_synergy + w3 × preparation_synergy
```

### 2. Diminishing Returns
Multiple foods of the same category might have diminishing synergy value:
- First dark leafy green: full score
- Second dark leafy green: 50% score
- Third dark leafy green: 25% score

### 3. Diversity Bonus
Encourage variety across food groups:
```
adjusted_score = base_synergy + diversity_bonus(candidate, selected_foods)
```

### 4. User Preferences
Learn from user behavior:
- Implicit feedback (accepted/rejected suggestions)
- Explicit ratings
- Dietary restrictions and allergies
- Taste preferences

### 5. Contextual Scoring
- Season availability (boost in-season foods)
- Budget constraints
- Preparation time
- Recipe integration (foods that work in same dish)

### 6. Multi-Day Planning
Current MVP assumes single meal/day. Future:
- Weekly variety optimization
- Don't suggest same food too often
- Balance across the week

### 7. Nutritional Completeness
Beyond synergies, ensure recommendations help reach nutritional targets:
- Daily dozen checklist
- Macro/micronutrient goals
- Caloric targets

### 8. Machine Learning
- Train on user behavior to learn synergies
- Personalized scoring models
- Discover unexpected food pairings

## Data Model Assumptions

For this algorithm to work, we assume:

1. **Foods database** with:
   - ID, name, category
   - Allowed meal types (breakfast, lunch, dinner, snack, any)

2. **Synergies database** with:
   - food_id_1, food_id_2 (normalized: id_1 < id_2)
   - score (numeric, can be negative)
   - reason (optional, for explanation)

3. **User selections** stored as:
   - Array of food IDs
   - Optional: meal context (breakfast/lunch/dinner/snack)

## Implementation Notes

### Performance Optimization
- Index synergies by food_id for fast lookup
- Cache frequently accessed synergy pairs
- Pre-filter candidates before scoring (timing constraints, dietary restrictions)

### Extensibility
- Algorithm should be pure function (no side effects)
- Easy to swap scoring logic
- Easy to add new filters and ranking criteria

### Testing Strategy
- Unit tests with known synergy values
- Edge cases (empty selections, all negative scores)
- Performance tests with realistic data volumes
- Integration tests with real food database
