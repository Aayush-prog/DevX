from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Load the pre-trained LayoutLM model
model_name = "microsoft/layoutlm-base-uncased"
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Prompt for text generation
prompt = "Write a short story about a robot who wants to be a chef."

# Tokenize the prompt
input_ids = tokenizer(prompt, return_tensors="pt").input_ids

# Generate text
generated_text_ids = model.generate(input_ids)
generated_text = tokenizer.decode(generated_text_ids[0], skip_special_tokens=True)

print(generated_text)