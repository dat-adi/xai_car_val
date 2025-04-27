import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Prediction data
prediction_data = [
    {'user': 'User 1',  "initial": 5300, "final": 2900},
    {'user': 'User 2',  "initial": 5100, "final": 2800},
    {'user': 'User 3',  "initial": 8000, "final": 3100},
    {'user': 'User 4',  "initial": 7700, "final": 3000},
    {'user': 'User 5',  "initial": 7200, "final": 3000},
    {'user': 'User 6',  "initial": 5000, "final": 3100},
    {'user': 'User 7',  "initial": 7000, "final": 2900},
    {'user': 'User 8',  "initial": 6800, "final": 3100},
    {'user': 'User 9',  "initial": 8200, "final": 2900},
    {'user': 'User 10', "initial": 7500, "final": 3000},
    {'user': 'User 11', "initial": 8500, "final": 5100},
    {'user': 'User 12', "initial": 7300, "final": 2900},
    {'user': 'User 13', "initial": 5100, "final": 3500},
    {'user': 'User 14', "initial": 6300, "final": 3000},
    {'user': 'User 15', "initial": 5200, "final": 3000},
    {'user': 'User 16', "initial": 7500, "final": 2800},
    {'user': 'User 17', "initial": 8700, "final": 3100},
    {'user': 'User 18', "initial": 7200, "final": 2700},
    {'user': 'User 19', "initial": 7800, "final": 4500},
    {'user': 'User 20', "initial": 5000, "final": 3000},
]

# Confidence data
confidence_data = [
    {'user': 'User 1',  'start': 4, 'end': 9},
    {'user': 'User 2',  'start': 3, 'end': 8},
    {'user': 'User 3',  'start': 5, 'end': 8},
    {'user': 'User 4',  'start': 4, 'end': 8},
    {'user': 'User 5',  'start': 3, 'end': 9},
    {'user': 'User 6',  'start': 2, 'end': 8},
    {'user': 'User 7',  'start': 4, 'end': 7},
    {'user': 'User 8',  'start': 3, 'end': 8},
    {'user': 'User 9',  'start': 4, 'end': 9},
    {'user': 'User 10', 'start': 5, 'end': 8},
    {'user': 'User 11', 'start': 3, 'end': 5},
    {'user': 'User 12', 'start': 2, 'end': 8},
    {'user': 'User 13', 'start': 7, 'end': 9},
    {'user': 'User 14', 'start': 3, 'end': 9},
    {'user': 'User 15', 'start': 5, 'end': 8},
    {'user': 'User 16', 'start': 3, 'end': 7},
    {'user': 'User 17', 'start': 2, 'end': 8},
    {'user': 'User 18', 'start': 4, 'end': 9},
    {'user': 'User 19', 'start': 5, 'end': 6},
    {'user': 'User 20', 'start': 2, 'end': 7},
]

# Convert to pandas DataFrames
pred_df = pd.DataFrame(prediction_data)
conf_df = pd.DataFrame(confidence_data)

# Create figure with two subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# Plot predictions
users = pred_df['user']
x = np.arange(len(users))
width = 0.35

# First chart: Initial vs Final Predictions
ax1.plot(x, pred_df['initial'], 'o-', color='blue', label='Initial Prediction')
ax1.plot(x, pred_df['final'], 'o-', color='green', label='Final Prediction')
ax1.set_title('Initial vs Final Car Valuation Predictions')
ax1.set_xlabel('Users')
ax1.set_ylabel('Prediction Value ($)')
ax1.set_xticks(x[::2])  # Show every second tick to avoid crowding
ax1.set_xticklabels(users[::2], rotation=45)
ax1.legend()
ax1.grid(True, linestyle='--', alpha=0.7)

# Calculate average values for annotation
avg_initial = pred_df['initial'].mean()
avg_final = pred_df['final'].mean()
ax1.axhline(y=avg_initial, color='blue', linestyle='--', alpha=0.5)
ax1.axhline(y=avg_final, color='green', linestyle='--', alpha=0.5)
ax1.annotate(f'Avg: ${avg_initial:.2f}', xy=(len(users)-1, avg_initial), 
             xytext=(len(users)-5, avg_initial+500), color='blue')
ax1.annotate(f'Avg: ${avg_final:.2f}', xy=(len(users)-1, avg_final), 
             xytext=(len(users)-5, avg_final+500), color='green')

# Second chart: Start vs End Confidence
ax2.plot(x, conf_df['start'], 'o-', color='orange', label='Confidence Start')
ax2.plot(x, conf_df['end'], 'o-', color='red', label='Confidence End')
ax2.set_title('Start vs End Confidence Levels')
ax2.set_xlabel('Users')
ax2.set_ylabel('Confidence Level (1-10)')
ax2.set_xticks(x[::2])  # Show every second tick to avoid crowding
ax2.set_xticklabels(users[::2], rotation=45)
ax2.set_ylim(0, 11)  # Set y-axis limit to accommodate confidence scale
ax2.legend()
ax2.grid(True, linestyle='--', alpha=0.7)

# Calculate average values for annotation
avg_start = conf_df['start'].mean()
avg_end = conf_df['end'].mean()
ax2.axhline(y=avg_start, color='orange', linestyle='--', alpha=0.5)
ax2.axhline(y=avg_end, color='red', linestyle='--', alpha=0.5)
ax2.annotate(f'Avg: {avg_start:.1f}', xy=(len(users)-1, avg_start), 
             xytext=(len(users)-5, avg_start+0.5), color='orange')
ax2.annotate(f'Avg: {avg_end:.1f}', xy=(len(users)-1, avg_end), 
             xytext=(len(users)-5, avg_end+0.5), color='red')

plt.tight_layout()
plt.savefig('car_valuation_analysis.png')

# Print some key statistics
print("\nKey Statistics:")
print(f"Average Initial Prediction: ${pred_df['initial'].mean():.2f}")
print(f"Average Final Prediction: ${pred_df['final'].mean():.2f}")
print(f"Average Prediction Change: ${(pred_df['initial'] - pred_df['final']).mean():.2f}")
print(f"Average Starting Confidence: {conf_df['start'].mean():.2f}")
print(f"Average Ending Confidence: {conf_df['end'].mean():.2f}")
print(f"Average Confidence Increase: {(conf_df['end'] - conf_df['start']).mean():.2f}")
