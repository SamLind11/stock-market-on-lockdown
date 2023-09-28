import csv
import json

def make_json(csvFilePath, jsonFilePath):
    
    # Create a dictionary
    data = {}
    
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        
        # Convert each row into a dictionary
        # and add it to data
        for rows in reversed(list(csvReader)):
            
            # Create new row dictionary for each row in csv.
            new_row = {}
            new_row['open'] = float(rows['Open'])
            new_row['high'] = float(rows['High'])
            new_row['low'] = float(rows['Low'])
            new_row['close'] = float(rows['Close'])
            new_row['volume'] = int(rows['Volume'].replace(",",""))
            
            # Use date as key for JSON.
            key = rows['Date']
            data[key] = new_row

    
    # Open a json writer, and use the json.dumps()
    # function to dump data

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

# Names of stocks to convert.
stocks = ['amzn', 'axp', 'bac', 'goog', 'hd', 'hsbc','jnj','lly',
          'lulu', 'mck', 'meta', 'mrk', 'ms', 'mtch', 'snap', 'spot',
          'tgt', 'unh', 'wfc', 'wsm']

# Convert all files in the csv folder to json, put json files in json folder.
for stock in stocks:
    csv_path = f"./csv/{stock}.csv"
    json_path = f"./json/{stock}.json"
    make_json(csv_path, json_path)