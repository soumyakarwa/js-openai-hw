import json
import pandas as pd

# Load JSON data
with open('./reviews.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Convert to a pandas DataFrame if applicable
df = pd.DataFrame(data)

print("column names")
print(df.columns)

# Example cleanup operations
df['column_name'] = df['column_name'].str.replace('unwanted_string', 'desired_string')

# Save cleaned data back to JSON
cleaned_data = df.to_dict(orient='records')
with open('cleaned_file.json', 'w', encoding='utf-8') as file:
    json.dump(cleaned_data, file, ensure_ascii=False, indent=4)
