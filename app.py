from flask import Flask, render_template, jsonify
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

# Create engine
engine = create_engine("sqlite:///stockmarket.db")

#Create Base
Base = automap_base()
Base.prepare(engine, reflect=True)

#Save references to the tables
Amazon = Base.classes.amzn
AmericanExpress = Base.classes.axp
BankofAmerica = Base.classes.bac
Google = Base.classes.goog
HomeDepot = Base.classes.hd
HSBC = Base.classes.hsbc
JohnsonJohnson = Base.classes.jnj
EliLilly = Base.classes.lly
Lululemon = Base.classes.lulu
McKesson = Base.classes.mck
Facebook = Base.classes.meta
Merck = Base.classes.mrk
MorganStanley = Base.classes.ms
Pinterest = Base.classes.pins
Snapchat = Base.classes.snap
Spotify = Base.classes.spot
Target = Base.classes.tgt
UnitedHealth = Base.classes.unh
WellsFargo = Base.classes.wfc
WilliamsSonoma = Base.classes.wsm

#Print the keys (table names) in the Base.classes dictionary
print(Base.classes.keys())

# Create session
session = Session(engine)

# Create app
app = Flask(__name__)

# Create routes
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/data")
def data():
    amazon_data = session.query(Amazon.id, Amazon.Stock, Amazon.date, Amazon.open, Amazon.high, Amazon.low, Amazon.close, Amazon.volume).all()
    stock_dict = {}
    for row in amazon_data:
        stock_dict[row['date']] = row['close']
        print(row)
    session.close()
    return jsonify(amazon_data)

if __name__ == "__main__":
    app.run(debug=True)


