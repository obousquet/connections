// A structured repository of themes, categories, and their associated words.
// Words can belong to multiple categories, allowing the puzzle generator 
// to compute difficulty based on overlapping terms across the dataset.

const wordRepository = {
    "Letter Patterns & Wordplay": {
        "Fruits starting with the letter P": ["Peach", "Pear", "Plum", "Papaya", "Pomegranate", "Pineapple", "Persimmon", "Pomelo"],
        "Prefixes of car brands": ["Chev", "Volks", "Toyo", "Hon", "Nis", "Mer", "Cad", "Sub"],
        "End in 'berry'": ["Straw", "Blue", "Black", "Cran", "Rasp", "Goose", "Elder", "Mul"],
        "Starts with 'Sun'": ["Flower", "Glasses", "Light", "Dial", "Set", "Rise", "Shine", "Burn"],
        "Palindromes": ["Racecar", "Level", "Radar", "Civic", "Kayak", "Madam", "Rotor", "Stats"],
        "Words that sound like letters": ["Sea", "Eye", "Jay", "Cue", "Are", "Tea", "You", "Why"],
        "Words ending in 'ology'": ["Biology", "Geology", "Zoology", "Theology", "Ecology", "Mythology", "Psychology", "Sociology"],
        "Starts with 'Geo'": ["Geometry", "Geography", "Geology", "Geode", "Gecko", "Geocentric", "Geothermal", "Geomancy"],
        "Words ending in 'ment'": ["Moment", "Garment", "Payment", "Argument", "Statement", "Document", "Fragment", "Segment"],
        "Words with double 'O'": ["Book", "Look", "Cook", "Hook", "Took", "Nook", "Rook", "Wood"],
        "Three-letter animals": ["Cat", "Dog", "Bat", "Rat", "Pig", "Cow", "Fox", "Ape"],
        "Words with exactly one consonant": ["Eye", "Awe", "Owe", "Era", "Are", "Ore", "Ale", "Icy"],
        "Synonyms for Happy": ["Glad", "Joyful", "Cheerful", "Merry", "Jolly", "Upbeat", "Thrilled", "Elated"]
    },
    "Pop Culture & Entertainment": {
        "James Bond characters": ["Bond", "M", "Q", "Moneypenny", "Blofeld", "Oddjob", "Jaws", "Scaramanga"],
        "Harry Potter characters": ["Harry", "Ron", "Hermione", "Snape", "Dumbledore", "Hagrid", "Sirius", "Draco"],
        "Lord of the Rings characters": ["Frodo", "Sam", "Gandalf", "Aragorn", "Legolas", "Gimli", "Gollum", "Sauron"],
        "Marvel superheroes": ["Ironman", "Thor", "Hulk", "Spiderman", "Wolverine", "Daredevil", "Deadpool", "Blade"],
        "Famous fictional detectives": ["Holmes", "Poirot", "Marple", "Columbo", "Monk", "Drew", "Hardy", "Spade"],
        "Disney princesses": ["Ariel", "Belle", "Cinderella", "Jasmine", "Mulan", "Pocahontas", "Snow", "Aurora"]
    },
    "Shared Word Associations": {
        "Things with a mouse": ["Computer", "Cat", "Trap", "Disney", "Maze", "Cheese", "Pad", "Hole"],
        "Things with a key": ["Lock", "Keyboard", "Map", "City", "Piano", "Florida", "Skeleton", "Major"],
        "Things with a board": ["Surf", "Key", "Skate", "Snow", "Dash", "Chalk", "White", "Mother"],
        "Things with a ring": ["Phone", "Saturn", "Engagement", "Boxing", "Circus", "Onion", "Tree", "Bell"],
        "Things you can catch": ["Cold", "Ball", "Breath", "Fish", "Train", "Feelings", "Fire", "Glimpse"],
        "Words following 'Black'": ["Board", "Berry", "Bird", "Mail", "Jack", "Hole", "Magic", "Out"],
        "Words preceding 'Paper'": ["Wall", "News", "Toilet", "Scrap", "Wax", "Sand", "Graph", "Blank"]
    },
    "Brands": {
        "Soap brands": ["Dove", "Ivory", "Dial", "Zest", "Coast", "Safeguard", "Olay", "Lux"],
        "Cereal brands": ["Cheerios", "Wheaties", "Kix", "Life", "Pops", "Trix", "Bran", "Chex"],
        "Sneaker brands": ["Nike", "Adidas", "Puma", "Reebok", "Vans", "Converse", "Fila", "Asics"],
        "Luxury fashion houses": ["Gucci", "Prada", "Chanel", "Dior", "Hermes", "Versace", "Fendi", "Armani"],
        "Fast food chains": ["McDonalds", "BurgerKing", "Wendys", "TacoBell", "KFC", "Subway", "Dominos", "Chipotle"]
    },
    "Games & Activities": {
        "Things you can play": ["Piano", "Game", "Music", "Fool", "Catch", "Role", "Guitar", "Sports"],
        "Classic card games": ["Poker", "Rummy", "Hearts", "Spades", "Bridge", "Euchre", "Pinochle", "GoFish"],
        "Board games": ["Monopoly", "Risk", "Clue", "Scrabble", "Chess", "Checkers", "Sorry", "Catan"],
        "Yoga poses": ["Dog", "Tree", "Mountain", "Warrior", "Child", "Lotus", "Cobra", "Bridge"],
        "Musical tempos": ["Allegro", "Adagio", "Andante", "Largo", "Presto", "Moderato", "Vivace", "Lento"]
    },
    "Locations & Objects": {
        "Objects found in a kitchen": ["Blender", "Toaster", "Microwave", "Spatula", "Whisk", "Oven", "Fridge", "Kettle"],
        "Objects used to repair a car": ["Wrench", "Jack", "Pliers", "Screwdriver", "Ratchet", "Socket", "Hammer", "Funnel"],
        "Things in a classroom": ["Chalkboard", "Desk", "Chair", "Eraser", "Pencil", "Ruler", "Globe", "Book"],
        "Items in a glovebox": ["Manual", "Registration", "Insurance", "Napkins", "Flashlight", "Pen", "Map", "Sunglasses"],
        "Things you find at the beach": ["Sand", "Shells", "Towel", "Sunscreen", "Umbrella", "Waves", "Seagull", "Crab"],
        "Types of pasta": ["Penne", "Spaghetti", "Macaroni", "Rigatoni", "Farfalle", "Fusilli", "Linguine", "Orzo"],
        "World currencies": ["Dollar", "Euro", "Yen", "Pound", "Franc", "Rupee", "Peso", "Ruble"]
    },
    "Food & Drink": {
        "Types of cheese": ["Cheddar", "Brie", "Gouda", "Swiss", "Feta", "Provolone", "Havarti", "Parmesan"],
        "Ways to prepare eggs": ["Scrambled", "Fried", "Poached", "Boiled", "Baked", "Deviled", "Shirred", "Basted"],
        "Classic cocktails": ["Martini", "Margarita", "Mojito", "Manhattan", "Negroni", "Daiquiri", "OldFashioned", "Cosmopolitan"],
        "Coffee drinks": ["Latte", "Espresso", "Cappuccino", "Americano", "Macchiato", "Mocha", "FlatWhite", "Cortado"]
    },
    "Science & Nature": {
        "Types of clouds": ["Cumulus", "Stratus", "Cirrus", "Nimbus", "Alto", "Lenticular", "Mammatus", "Contrail"],
        "Constellations": ["Orion", "Ursa", "Cassiopeia", "Draco", "Pegasus", "Lyra", "Cygnus", "Andromeda"],
        "Precious gemstones": ["Diamond", "Ruby", "Sapphire", "Emerald", "Amethyst", "Topaz", "Opal", "Garnet"],
        "Elements on the periodic table": ["Helium", "Oxygen", "Carbon", "Gold", "Iron", "Sodium", "Calcium", "Zinc"]
    },
    "History & Geography": {
        "US State Capitals": ["Austin", "Boston", "Denver", "Atlanta", "Phoenix", "Sacramento", "Nashville", "Raleigh"],
        "European countries": ["France", "Germany", "Spain", "Italy", "Greece", "Sweden", "Poland", "Austria"],
        "Famous landmarks": ["Eiffel", "Colosseum", "TajMahal", "BigBen", "Acropolis", "Stonehenge", "Alhambra", "MachuPicchu"],
        "Oceans and Seas": ["Atlantic", "Pacific", "Indian", "Arctic", "Mediterranean", "Caribbean", "Baltic", "Red"]
    },
    "Basic Categories": {
        "Colors": ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Brown"],
        "Furniture": ["Chair", "Table", "Sofa", "Bed", "Desk", "Cabinet", "Stool", "Dresser"],
        "Fruits": ["Apple", "Banana", "Orange", "Grape", "Kiwi", "Mango", "Pear", "Peach"],
        "Trees": ["Oak", "Pine", "Maple", "Birch", "Cedar", "Elm", "Willow", "Ash"],
        "Mushrooms": ["Portobello", "Cremini", "Shiitake", "Oyster", "Enoki", "Morel", "Porcini", "Chanterelle"]
    }
};