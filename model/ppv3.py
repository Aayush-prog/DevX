import json
from transformers import LayoutLMv3TokenizerFast

# Paths
INPUT_JSON = "C:/Users/ACER/Downloads/project-3-at-2024-12-19-08-43-0491be99.json"
OUTPUT_JSONL = "output.jsonl"

# Tokenizer
tokenizer = LayoutLMv3TokenizerFast.from_pretrained("microsoft/layoutlmv3-base")

def normalize_bbox(bbox, width, height):
    """Normalize bounding box coordinates."""
    if width == 0 or height == 0:
        return [0, 0, 0, 0]
    
    normalized = [
        round(bbox['x'] / width, 6),  # Normalize x by width
        round(bbox['y'] / height, 6),  # Normalize y by height
        round((bbox['x'] + bbox['width']) / width, 6),  # Normalize x2 by width
        round((bbox['y'] + bbox['height']) / height, 6)  # Normalize y2 by height
    ]
    return normalized

def process_json(input_path, output_path):
    with open(input_path, "r") as f:
        data = json.load(f)
    
    processed_data = []
    
    for item in data:
        words = []
        bboxes = []
        labels = []

        image_path = item.get('data', {}).get('ocr', '')

        # Loop through annotations to extract words, bboxes, and labels
        for annotation in item.get('annotations', []):
            for result_item in annotation.get('result', []):
                value = result_item.get('value', {})

                # Extracting the bounding box (bbox) details
                bbox = {
                    "x": value.get('x', 0),
                    "y": value.get('y', 0),
                    "width": value.get('width', 0),
                    "height": value.get('height', 0)
                }
                
                # Normalizing the bbox
                original_width = result_item.get('original_width', 1)
                original_height = result_item.get('original_height', 1)
                normalized_bbox = normalize_bbox(bbox, original_width, original_height)
                
                # Extracting text from the transcription field and appending to words list
                text = value.get('text', '')
                if text:
                    words.append(text)  # Changed to value.get('text', '')
                    bboxes.append(normalized_bbox)

                # Handling potential missing or empty labels
                label = value.get('labels', [])
                if isinstance(label, list):
                    labels.append(label)  # Append the list of labels
                else:
                    labels.append([label])  # Ensure label is in a list

        # Flattening words and labels (if necessary) to ensure consistency
        words = [word for sublist in words for word in sublist]
        labels = [label for sublist in labels for label in sublist]

        print(f"Words: {words}")
        print(f"Bboxes: {bboxes}")
        print(f"Labels: {labels}")    

        # Ensure the lengths of words and bboxes match
        if len(words) != len(bboxes):
            print(f"Warning: Mismatch in number of words and bounding boxes. Words: {len(words)}, Bboxes: {len(bboxes)}")

        # Tokenize words and provide bounding boxes
        tokenized = tokenizer(words, boxes=bboxes, truncation=True, return_offsets_mapping=True)
        print(f"Tokenized bbox:{tokenized['bbox']}")
        # Map labels to tokens
        token_labels = []
        word_ids = tokenized.word_ids()
        
        for word_id in word_ids:
            if word_id is None:
                token_labels.append("O")  # Default label for special tokens
            else:
                token_labels.append(labels[word_id] if word_id < len(labels) else "O")

        # Append the processed data to the list
        processed_data.append({
            "image_path": image_path,
            "input_ids": tokenized.input_ids,
            "attention_mask": tokenized.attention_mask,
            "bboxes": tokenized["bbox"],
            "labels": token_labels
        })

    # Save as JSONL
    with open(output_path, "w") as f:
        for entry in processed_data:
            json.dump(entry, f)
            f.write("\n")

# Process the JSON
process_json(INPUT_JSON, OUTPUT_JSONL)
