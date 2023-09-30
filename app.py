from flask import Flask, render_template, jsonify
from sqlalchemy import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#Create engine
engine = create_engine()
Base = automap_base()
Base.prepare(engine, reflect=True)

#Save references to each table

#Create session
session = Session(engine)

#Create Flask app
app = Flask(__name__)

#Create routes
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/data")
    def data():

session.close()

return jsonify(clean_data)

if __name__ == "__main__":
    app.run(debug=True)

