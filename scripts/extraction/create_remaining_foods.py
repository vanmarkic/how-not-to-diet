#!/usr/bin/env python3
import json
import os

foods_dir = "/Users/dragan/Documents/how-not-to-diet/data/foods"

# Remaining foods to create
foods_to_create = [
    {
        "filename": "hibiscus-tea.json",
        "data": {
            "id": "food-105",
            "name": "Hibiscus Tea",
            "categories": ["beverages", "anti-inflammatory", "weight-loss-booster", "antioxidant-rich"],
            "properties": [
                "Rich in anthocyanins and antioxidants",
                "Anti-inflammatory properties",
                "Supports cardiovascular health",
                "Calorie-free beverage",
                "Can be mixed with lemon verbena",
                "Acceptable meal beverage"
            ],
            "benefits": "Hibiscus tea is rich in anthocyanins and powerful antioxidants that support weight loss and cardiovascular health. Unlike some teas, it can be consumed during meals without interfering with nutrient absorption. When mixed 6:1 with lemon verbena, it creates a synergistic blend. Hibiscus has been shown to support healthy blood pressure and may help with fat metabolism.",
            "synergies": ["lemon-verbena", "meals-in-general", "water-preload"],
            "conflicts": [],
            "timing": ["during-meals", "daily"],
            "amount": "Can be consumed during meals, mixed 6:1 with lemon verbena",
            "sources": {
                "pages": [25],
                "quotes": ["During meals, drink water, black coffee or hibiscus tea mixed 6:1 with lemon verbena, but never exceed 3 cups of fluid per hour."]
            }
        }
    },
    {
        "filename": "lemon-verbena.json",
        "data": {
            "id": "food-106",
            "name": "Lemon Verbena",
            "categories": ["herbs-and-spices", "beverages", "anti-inflammatory", "digestive-support"],
            "properties": [
                "Aromatic herb for tea",
                "Digestive support properties",
                "Anti-inflammatory compounds",
                "Calming effects",
                "Synergistic with hibiscus tea",
                "Rich in antioxidants"
            ],
            "benefits": "Lemon verbena is an aromatic herb traditionally used for digestive support and its calming properties. When mixed with hibiscus tea (1 part lemon verbena to 6 parts hibiscus), it creates a synergistic beverage blend that can be consumed during meals. The herb contains powerful antioxidants and anti-inflammatory compounds that support overall health and weight management.",
            "synergies": ["hibiscus-tea", "meals-in-general", "digestive-health"],
            "conflicts": [],
            "timing": ["during-meals", "daily"],
            "amount": "Mix 1 part with 6 parts hibiscus tea",
            "sources": {
                "pages": [25],
                "quotes": ["During meals, drink water, black coffee or hibiscus tea mixed 6:1 with lemon verbena."]
            }
        }
    },
    {
        "filename": "black-coffee.json",
        "data": {
            "id": "food-107",
            "name": "Black Coffee",
            "categories": ["beverages", "weight-loss-booster", "metabolism-boosting", "antioxidant-rich"],
            "properties": [
                "Metabolism-boosting beverage",
                "Contains chlorogenic acid",
                "Rich in antioxidants",
                "Caffeine for appetite suppression",
                "Calorie-free when black",
                "Acceptable during meals",
                "Reinforcing effect with healthy foods"
            ],
            "benefits": "Black coffee is a powerful weight-loss beverage rich in chlorogenic acid and antioxidants that boost metabolism and fat burning. The caffeine provides appetite suppression and increased energy expenditure. Coffee has a reinforcing effect, meaning when consumed with healthy foods you want to like more, it can help build positive associations. Avoid large amounts within 6 hours of bedtime to prevent sleep disruption.",
            "synergies": ["meals-in-general", "healthy-foods", "morning-routine"],
            "conflicts": ["bedtime-within-6-hours"],
            "timing": ["morning", "during-meals", "not-within-6-hours-of-bedtime"],
            "amount": "As desired, but avoid late consumption",
            "sources": {
                "pages": [25],
                "quotes": [
                    "During meals, drink water, black coffee or hibiscus tea mixed 6:1 with lemon verbena.",
                    "Take advantage of the reinforcing effect of caffeine by drinking your green tea along with something healthy you wish you liked more, but don't consume large amounts of caffeine within six hours of bedtime."
                ]
            }
        }
    },
    {
        "filename": "chai-tea.json",
        "data": {
            "id": "food-111",
            "name": "Chai Tea",
            "categories": ["beverages", "weight-loss-booster", "metabolism-boosting", "thermogenic"],
            "properties": [
                "Combines green tea and ginger benefits",
                "Metabolism-boosting",
                "Thermogenic properties from spices",
                "Contains catechins and gingerols",
                "Multiple weight-loss compounds in one beverage",
                "Traditional spices support digestion"
            ],
            "benefits": "Chai tea is highlighted as a way to combine the green tea and ginger weight-loss tricks into a single tasty beverage. It delivers the metabolism-boosting catechins from green tea along with the thermogenic gingerols from ginger. Traditional chai spices like cinnamon, cardamom, and black pepper add additional metabolic benefits. This makes it an efficient way to get multiple weight-loss boosters simultaneously.",
            "synergies": ["green-tea", "ginger-ground", "cinnamon", "black-pepper", "morning-routine"],
            "conflicts": ["bedtime-within-6-hours"],
            "timing": ["morning-preferred", "between-meals", "not-within-6-hours-of-bedtime"],
            "amount": "Can count toward 3 cups of green tea daily",
            "sources": {
                "pages": [24],
                "quotes": ["Ginger may work better in the morning than evening, and consider chai tea as a tasty way to combine the green tea and ginger tricks into a single beverage."]
            }
        }
    }
]

# Create the files
for food_item in foods_to_create:
    filepath = os.path.join(foods_dir, food_item["filename"])
    if not os.path.exists(filepath):
        with open(filepath, 'w') as f:
            json.dump(food_item["data"], f, indent=2)
        print(f"Created: {food_item['filename']}")
    else:
        print(f"Already exists: {food_item['filename']}")

print("\nDone!")
