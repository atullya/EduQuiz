from transformers import T5Tokenizer, T5ForConditionalGeneration

T5Tokenizer.from_pretrained("valhalla/t5-base-qg-hl")
T5ForConditionalGeneration.from_pretrained("valhalla/t5-base-qg-hl")
