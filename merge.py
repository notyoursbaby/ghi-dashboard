import os
import pandas as pd

all_data = []

for root, dirs, files in os.walk("GHI"):
    for file in files:
        if file.endswith(".csv"):
            path = os.path.join(root, file)
            print("Reading:", path)

            df = pd.read_csv(path)
            all_data.append(df)

final = pd.concat(all_data, ignore_index=True)
final.to_csv("merged.csv", index=False)

print("Done!")