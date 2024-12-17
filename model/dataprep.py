import json

# Load the Label Studio JSON export
with open("annotations.json", "r") as file:
    labelstudio_data = json.load(file)

# Function to convert relative coordinates to absolute
def convert_bbox(value, img_width, img_height):
    x_min = int(value["x"] / 100 * img_width)
    y_min = int(value["y"] / 100 * img_height)
    x_max = int((value["x"] + value["width"]) / 100 * img_width)
    y_max = int((value["y"] + value["height"]) / 100 * img_height)
    return [x_min, y_min, x_max, y_max]

# Prepare data for LayoutLMv3
processed_data = []
for item in labelstudio_data:
    document = {"words": [], "bboxes": [], "labels": []}
    for annotation in item["annotations"][0]["result"]:
        bbox = annotation["value"]
        label = annotation["value"]["rectanglelabels"][0]
        img_width, img_height = bbox["original_width"], bbox["original_height"]

        # Convert bbox to absolute coordinates
        absolute_bbox = convert_bbox(bbox, img_width, img_height)

        # Append data
        document["bboxes"].append(absolute_bbox)
        document["labels"].append(label)
        document["words"].append("")  # Add OCR extracted text later if available

    processed_data.append(document)

# Save processed data to a JSON file
with open("processed_data.json", "w") as file:
    json.dump(processed_data, file, indent=4)

print("Data processed and saved as 'processed_data.json'")
