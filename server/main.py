from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Flask, request, jsonify, send_file
import pandas as pd
import pickle

model_filename = 'model.pkl'
loaded_model = pickle.load(open(f'{model_filename}', 'rb'))

app = Flask(__name__)
CORS(app)


@app.route('/feature-importance')
def feature_importance():
    return send_file('feature_importance.json')

@app.route('/model', methods=['POST'])
def prompt_model():
    try:
        data = request.json
        print(data)

        df_predict = pd.DataFrame([data], index=[0])

        X_predict = df_predict[['homeworld', 'unit_type']]

        X_predict_encoded = pd.get_dummies(X_predict[['homeworld', 'unit_type']])

        all_columns = ['homeworld_Alderaan', 'homeworld_Aleen Minor', 'homeworld_Bestine IV',
           'homeworld_Cerea', 'homeworld_Champala', 'homeworld_Chandrila',
           'homeworld_Concord Dawn', 'homeworld_Corellia', 'homeworld_Dagobah',
           'homeworld_Dathomir', 'homeworld_Dorin', 'homeworld_Eriadu',
           'homeworld_Glee Anselm', 'homeworld_Haruun Kal', 'homeworld_Iktotch',
           'homeworld_Iridonia', 'homeworld_Kalee', 'homeworld_Kashyyyk',
           'homeworld_Malastare', 'homeworld_Mirial', 'homeworld_Mon Cala',
           'homeworld_Muunilinst', 'homeworld_Naboo', 'homeworld_Ojom',
           'homeworld_Quermia', 'homeworld_Rodia', 'homeworld_Ryloth',
           'homeworld_Serenno', 'homeworld_Shili', 'homeworld_Skako',
           'homeworld_Socorro', 'homeworld_Stewjon', 'homeworld_Sullust',
           'homeworld_Tatooine', 'homeworld_Tholoth', 'homeworld_Toydaria',
           'homeworld_Trandosha', 'homeworld_Troiken', 'homeworld_Tund',
           'homeworld_Umbara', 'homeworld_Vulpter', 'homeworld_Zolan',
           'unit_type_at-at', 'unit_type_at-st', 'unit_type_resistance_soldier',
           'unit_type_stormtrooper', 'unit_type_tie_fighter',
           'unit_type_tie_silencer', 'unit_type_unknown', 'unit_type_x-wing']
        
        for column_name in all_columns:
            if column_name not in X_predict_encoded:
                X_predict_encoded[column_name] = False

        # Ensure columns are in the correct order
        X_predict_encoded = X_predict_encoded[all_columns]

        prediction = loaded_model.predict(X_predict_encoded)
        print(prediction)

        prediction_list = prediction.tolist()

        return jsonify({"prediction": prediction_list}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

