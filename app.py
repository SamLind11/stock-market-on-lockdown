from flask import Flask, render_template, jsonify
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Create engine
engine = create_engine("sqlite:///stockmarket.db")
Base = automap_base()
Base.prepare(autoload_with=engine)

# Save references to each table

# Create session
session = Session(engine)

# Create app
app = Flask(__name__)

# Create routes
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/data/<stock>")
def data(stock):
    table = Base.classes[stock]
    data = session.query(table.id, table.date, table.open, table.high, table.low, table.close, table.volume).all()
    
    stock_data = []
    for row in data:
        row_dict = {}
        row_dict['id'] = row.id
        
    session.close()
    
    return jsonify(stock_data)

if __name__ == "__main__":
    app.run(debug=True)

data('amzn')