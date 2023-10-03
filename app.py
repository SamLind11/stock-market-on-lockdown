from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stockmarket.db'
db = SQLAlchemy(app)

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stock_symbol = db.Column(db.String(10))
    date = db.Column(db.String(20))
    open_price = db.Column(db.Float)
    high_price = db.Column(db.Float)
    low_price = db.Column(db.Float)
    close_price = db.Column(db.Float)
    volume = db.Column(db.Integer)

# Route to render the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint to get stock data for a specific stock symbol
@app.route('/api/stock_data', methods=['GET'])
def get_stock_data():
    stock_symbol = request.args.get('stock_symbol')
    # Query the specific table based on the stock symbol provided
    table_name = stock_symbol.lower()
    stock_data = Stock.query.filter_by(stock_symbol=stock_symbol).all()
    stock_list = []
    for stock in stock_data:
        stock_list.append({
            'date': stock.date,
            'open': stock.open_price,
            'high': stock.high_price,
            'low': stock.low_price,
            'close': stock.close_price,
            'volume': stock.volume
        })
    return jsonify({'data': stock_list})

if __name__ == '__main__':
    app.run(debug=True)









# from flask import Flask, render_template, jsonify
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func

# # Create engine
# engine = create_engine("sqlite:///stockmarket.db")

# #Create Base
# Base = automap_base()
# Base.prepare(engine, reflect=True)

# #Save references to the tables
# Amazon = Base.classes.amz
# AmericanExpress = Base.classes.axp
# BankofAmerica = Base.classes.bac
# Google = Base.classes.goog
# HomeDepot = Base.classes.hd
# HSBC = Base.classes.hsbc
# JohnsonJohnson = Base.classes.jnj
# EliLilly = Base.classes.lly
# Lululemon = Base.classes.lulu
# McKesson = Base.classes.mck
# Facebook = Base.classes.meta
# Merck = Base.classes.mrk
# MorganStanley = Base.classes.ms
# Pinterest = Base.classes.pins
# Snapchat = Base.classes.snap
# Spotify = Base.classes.spot
# Target = Base.classes.tgt
# UnitedHealth = Base.classes.unh
# WellsFargo = Base.classes.wfc
# WilliamsSonoma = Base.classes.wsm

# #Print the keys (table names) in the Base.classes dictionary
# print(Base.classes.keys())

# # Create session
# session = Session(engine)

# # Create app
# app = Flask(__name__)

# # Create routes
# @app.route("/")
# def home():
#     return render_template("index.html")

# @app.route("/data")
# def data():
#     amazon_data = session.query(Amazon.id, Amazon.Stock, Amazon.date, Amazon.open, Amazon.high, Amazon.low, Amazon.close, Amazon.volume).all()
#     clean_amzn=[]
#     for  in amazon_data:
#         amzn_dict={
#             "id": id,
#             "Stock": stock.Stock
#             amzn_dict["Stock"]=amzn.Stock
#             amzn_dict["Date"]=amzn.date
#             amzn_dict["Open"]=amzn.open
#             amzn_dict["High"]=amzn.high
#             amzn_dict["Low"]=amzn.low
#             amzn_dict["Close"]=amzn.close
#             amzn_dict["Volume"]=amzn.volume
#             clean_amzn.append(amzn_dict)
#         session.close()
    
#         return jsonify(clean_amzn)

# if __name__ == "__main__":
#     app.run(debug=True)


