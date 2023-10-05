from flask import Flask, render_template, jsonify
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask_cors import CORS

# Create engine
engine = create_engine("sqlite:///stockmarket.db", connect_args={'check_same_thread': False})

#Create Base
Base = automap_base()
Base.prepare(engine, reflect=True)

#Print the keys (table names) in the Base.classes dictionary
print(Base.classes.keys())


# Create session
session = Session(engine)

# Create app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Create routes
@app.route("/")
def home():
    return render_template("index.html")

# Return data for a given stock in json format.
@app.route("/api/data/<stock>")
def data(stock):
    stock = stock.upper()
    table = Base.classes[stock]
    data = session.query(table.id, table.Date, table.Open, table.High, table.Low, table.Close, table.Volume).all()
    data_dict = []
    for row in data:
        new = {}
        new['id'] = row.id
        new['date'] = row.Date
        new['open'] = row.Open
        new['high'] = row.High
        new['low'] = row.Low
        new['close'] = row.Close
        new['volume'] =  row.Volume
        
        data_dict.append(new)
    data_dict.reverse()
    return jsonify(data_dict)


# Returns data for all stocks for a given date. Format must be MM-DD-YY
@app.route("/api/byDate/<date>")
def byDate(date):
    slash_date = str(date).replace("-","/")
    table_keys = Base.classes.keys()
    data_list = []
    for key in table_keys:
        table = Base.classes[key]
        data = session.query(table.id, table.Date, table.Open, table.High, table.Low, table.Close, table.Volume) \
                            .filter(table.Date == slash_date)
        for row in data:
            new = {}
            new['stock'] = key
            new['id'] = row.id
            new['date'] = row.Date
            new['open'] = row.Open
            new['high'] = row.High
            new['low'] = row.Low
            new['close'] = row.Close
            new['volume'] =  row.Volume
            data_list.append(new)
    return jsonify(data_list)

if __name__ == "__main__":
    app.run(debug=False)