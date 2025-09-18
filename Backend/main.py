import sys
import json

# Get image path from Node.js
image_path = sys.argv[1]

# TODO: Load your ML model here and make prediction
# For now, let's return a dummy result
prediction = {
    "disease": "Leaf Blight",
    "solution": "Use copper-based fungicide, avoid waterlogging, and remove infected leaves."
}

print(json.dumps(prediction))
