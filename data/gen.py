import json
from pprint import pprint

with open('teams.json') as data_file:    
    data = json.load(data_file)

people = []
for majorkey, subdict in data["teams"].items():
    for subkey, value in subdict.items():
            if subkey == "people":
                for person in value:
                    people.append(person)
            else:
                people.append(value)

print(people)

template = """{{
    "{}" : {{
	"name": "{}",
	"wiki": "",
	"dob": "",
	"dod": ""
    }}
}}"""

filename = "{}.json"

for person in people:
    real_name = person.replace("-", " ")
    json_file = filename.format(person)
    with open(json_file, 'w') as f:
        f.write(template.format(person, real_name))
