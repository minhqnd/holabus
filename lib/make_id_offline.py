import random
import string
import json

def generate_ticket_ids(count, length=5):
    """
    Generate a list of unique ticket IDs.

    :param count: Number of IDs to generate.
    :param length: Length of each ID.
    :return: List of unique ticket IDs.
    """
    ids = set()
    while len(ids) < count:
        id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        ids.add(id)
    return list(ids)

# Generate 300 unique ticket IDs
ticket_ids = generate_ticket_ids(300)

# Save to a JSON file
output_file = "ticketpools.json"
with open(output_file, "w") as f:
    json.dump({"tickets": ticket_ids}, f, indent=4)

print(f"Generated {len(ticket_ids)} ticket IDs and saved to {output_file}.")
