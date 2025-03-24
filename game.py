import random

# ROCK-PAPER-SCISSORS
rps_comp_move = None
def rps_start():
    global rps_comp_move
    rps_comp_move = random.choice(["rock", "paper", "scissors"])
    return ("Rock-Paper-Scissors started!\n"
            "Type 'rock', 'paper', or 'scissors' to guess.")
def rps_guess(user_move):
    global rps_comp_move
    if not rps_comp_move:
        return "No RPS game in progress. Use 'python-game start'."
    valid = ["rock", "paper", "scissors"]
    if user_move not in valid:
        return f"Invalid guess: {user_move}."
    msg = f"Computer chose: {rps_comp_move}\n"
    if user_move == rps_comp_move:
        msg += "It's a tie!"
    elif ((user_move=="rock" and rps_comp_move=="scissors") or
          (user_move=="paper" and rps_comp_move=="rock") or
          (user_move=="scissors" and rps_comp_move=="paper")):
        msg += "You win!"
    else:
        msg += "You lose!"
    rps_comp_move = None
    return msg

# CALCULATOR
def calc():
    return "Python Calculator!\nUse: python-calc 2+2"
def calc_eval(expr):
    try:
        val = eval(expr)
        return f"Result = {val}"
    except:
        return "Error in expression."

# SNAKE
snake_in_progress = False
snake_position = [5,5]
snake_apples = []
snake_score = 0
def snake_start():
    global snake_in_progress, snake_position, snake_apples, snake_score
    snake_in_progress = True
    snake_position = [5,5]
    snake_apples = [[3,3], [7,7]]
    snake_score = 0
    return "Snake started! 'snake up/down/left/right'."
def snake_move(direction):
    global snake_in_progress, snake_position, snake_apples, snake_score
    if not snake_in_progress:
        return "No snake game in progress. Type 'snake'."
    if direction not in ["up", "down", "left", "right"]:
        return f"Unknown direction: {direction}"
    if direction == "up":
        snake_position[1] -= 1
    elif direction == "down":
        snake_position[1] += 1
    elif direction == "left":
        snake_position[0] -= 1
    else:
        snake_position[0] += 1
    msg = f"Moved {direction}, pos={snake_position}\n"
    if snake_position in snake_apples:
        snake_score += 1
        snake_apples.remove(snake_position[:])
        msg += f"Ate apple! Score={snake_score}\n"
    msg += f"Apples left: {snake_apples}"
    return msg

# PONG
pong_in_progress = False
pong_ball_pos = [0,0]
def pong_start():
    global pong_in_progress, pong_ball_pos
    pong_in_progress = True
    pong_ball_pos = [0,0]
    return "Pong started. 'pong up/down/left/right'."
def pong_action(action):
    global pong_in_progress, pong_ball_pos
    if not pong_in_progress:
        return "No pong game in progress. Type 'pong'."
    if action not in ["up", "down", "left", "right"]:
        return f"Unknown action: {action}"
    if action == "up":
        pong_ball_pos[1] -= 1
    elif action == "down":
        pong_ball_pos[1] += 1
    elif action == "left":
        pong_ball_pos[0] -= 1
    else:
        pong_ball_pos[0] += 1
    return f"Pong ball => {pong_ball_pos}"

# SPACE INVADERS
invaders_in_progress = False
invaders_player_pos = 5
invaders_aliens = []
invaders_bullets = []
def space_invaders_start():
    global invaders_in_progress, invaders_player_pos, invaders_aliens, invaders_bullets
    invaders_in_progress = True
    invaders_player_pos = 5
    invaders_aliens = [[2,0], [4,0], [6,0]]
    invaders_bullets = []
    return "Space Invaders started. 'invaders left/right/shoot'."
def space_invaders_action(action):
    global invaders_in_progress, invaders_player_pos, invaders_aliens, invaders_bullets
    if not invaders_in_progress:
        return "No invaders game in progress. Type 'invaders'."
    if action not in ["left", "right", "shoot"]:
        return f"Unknown action: {action}"
    if action == "left":
        invaders_player_pos = max(0, invaders_player_pos - 1)
    elif action == "right":
        invaders_player_pos = min(10, invaders_player_pos + 1)
    else:
        invaders_bullets.append([invaders_player_pos, 9])
    for a in invaders_aliens:
        a[1] += 1
    for b in invaders_bullets:
        b[1] -= 1
    hits = []
    for b in invaders_bullets:
        for a in invaders_aliens:
            if b[0] == a[0] and b[1] == a[1]:
                hits.append((b, a))
    for (bb, aa) in hits:
        if bb in invaders_bullets: invaders_bullets.remove(bb)
        if aa in invaders_aliens: invaders_aliens.remove(aa)
    game_over = any(a[1] > 9 for a in invaders_aliens)
    you_win = (len(invaders_aliens) == 0)
    if game_over or you_win:
        invaders_in_progress = False
    grid = [[" "]*11 for _ in range(11)]
    for ax, ay in invaders_aliens:
        if 0 <= ax < 11 and 0 <= ay < 11:
            grid[ay][ax] = "A"
    for bx, by in invaders_bullets:
        if 0 <= bx < 11 and 0 <= by < 11:
            grid[by][bx] = "^"
    grid[10][invaders_player_pos] = "P"
    ascii_lines = ["".join(row) for row in grid[::-1]]
    msg = f"Action '{action}'\n" + "\n".join(ascii_lines) + "\n"
    if hits:
        msg += f"You hit {len(hits)} alien(s)!\n"
    msg += f"Player={invaders_player_pos}, Aliens={invaders_aliens}, Bullets={invaders_bullets}\n"
    if you_win:
        msg += "All aliens destroyed! You win!"
    if game_over and not you_win:
        msg += "Aliens reached you – Game Over!"
    return msg

# TEXT ADVENTURE
adventure_in_progress = False
adventure_location = "start"
inventory = []
def text_adventure_start():
    global adventure_in_progress, adventure_location, inventory
    adventure_in_progress = True
    adventure_location = "start"
    inventory = []
    return ("Text Adventure started!\n"
            "Commands: 'adventure look', 'adventure go north', etc.\n"
            "Goal: unlock the chest puzzle in the forest!")
def text_adventure_action(action):
    global adventure_in_progress, adventure_location, inventory
    if not adventure_in_progress:
        return "No adventure in progress. Type 'adventure'."
    parts = action.split()
    if not parts:
        return "No action. e.g. 'look', 'go north', 'puzzle'"
    verb = parts[0]
    rest = parts[1:] if len(parts) > 1 else []
    if verb == "look":
        if adventure_location == "start":
            return "You stand in a clearing. A sign warns 'Beware the puzzle...'\nPaths: north."
        elif adventure_location == "forest":
            return ("You're in a dark forest. A locked chest sits on the ground.\n"
                    "Paths: south.\nUse 'adventure puzzle' to examine the chest.")
        else:
            return "Nothing special here."
    elif verb == "go":
        if not rest:
            return "Go where?"
        direction = rest[0]
        if direction == "north" and adventure_location == "start":
            adventure_location = "forest"
            return "You head north into the forest."
        elif direction == "south" and adventure_location == "forest":
            adventure_location = "start"
            return "You head south back to the clearing."
        else:
            return f"Can't go {direction}."
    elif verb == "puzzle":
        if adventure_location == "forest":
            return ("The chest puzzle reads:\n'I style each page, controlling color & shape;\n"
                    "Without me, everything is plain.\nI'm not HTML, but I complement its domain.'\n"
                    "Try 'adventure unlock css'")
        else:
            return "No puzzle here."
    elif verb == "unlock":
        if not rest:
            return "Unlock what? Try 'adventure unlock css'"
        guess = rest[0].lower()
        if guess == "css" and adventure_location == "forest":
            return ("Chest unlocked! Inside is a note:\n'The puzzle's answer is CSS. Good job!'\n"
                    "Adventure complete!")
        return "That doesn't unlock anything here."
    else:
        return f"Unknown action: {verb}"
        
# EASTER EGGS
def egg1_start():
    return "Easter Egg #1 found!\nA glitch cube appears, spinning in mid-air..."
def egg5_start():
    return "SYSTEM BREACH DETECTED\nCode: E-99Ω\nA full-screen glitch devours your terminal!"

# DUNGEONS & DRAGONS
dnd_active = False
player = {}
current_enemy = None

def dnd_start():
    global dnd_active, player, current_enemy
    dnd_active = True
    player = {
        'name': 'Brave Adventurer',
        'level': 1,
        'hp': 100,
        'max_hp': 100,
        'strength': 10,
        'dexterity': 10,
        'defense': 5,
        'xp': 0,
        'armor': 'Leather Armor',
        'weapon': 'Iron Sword',
        'inventory': ['Potion'],
        'gold': 10
    }
    current_enemy = None
    return ("Your adventure begins in the mystical land of Eldoria!\n"
            "Commands: 'dnd explore', 'dnd status', 'dnd potion', 'dnd equip [item]', 'dnd roll [action]'.")

def dnd_action(command):
    global dnd_active, player, current_enemy
    if not dnd_active:
        return "Start your adventure first! Use 'dnd start'."

    if player['hp'] <= 0:
        dnd_active = False
        return "You have fallen in battle. Your story ends here."

    if player['level'] >= 20:
        dnd_active = False
        return "You've reached level 20 and have become a legendary hero of Eldoria! Congratulations!"

    if command == "explore":
        scenario = random.choice(['battle', 'treasure', 'trap', 'merchant', 'event'])
        if scenario == 'battle':
            current_enemy = generate_enemy(player['level'])
            return f"You encountered a {current_enemy['name']}! Prepare for battle with 'dnd roll attack'."
        elif scenario == 'treasure':
            return find_treasure()
        elif scenario == 'trap':
            return trigger_trap()
        elif scenario == 'merchant':
            return meet_merchant()
        elif scenario == 'event':
            return special_event()

    elif command == "status":
        inv = ', '.join(player['inventory'])
        return (f"Level: {player['level']} | HP: {player['hp']}/{player['max_hp']} | XP: {player['xp']} | Gold: {player['gold']}\n"
                f"Strength: {player['strength']} | Dexterity: {player['dexterity']} | Defense: {player['defense']}\n"
                f"Armor: {player['armor']} | Weapon: {player['weapon']}\nInventory: {inv}")

    elif command == "potion":
        if 'Potion' in player['inventory']:
            heal = min(50, player['max_hp'] - player['hp'])
            player['hp'] += heal
            player['inventory'].remove('Potion')
            return f"You restored {heal} HP. Current HP: {player['hp']}"
        return "You have no potions left."

    elif command.startswith("equip"):
        item = command.split(maxsplit=1)[-1]
        if item in player['inventory']:
            if 'Armor' in item:
                player['armor'] = item
                player['defense'] += 5
                player['inventory'].remove(item)
                return f"You equipped {item}. Your defense increased!"
            elif 'Sword' in item or 'Bow' in item or 'Axe' in item:
                player['weapon'] = item
                player['strength'] += 5
                player['inventory'].remove(item)
                return f"You equipped {item}. Your strength increased!"
            else:
                return "You cannot equip that item."
        return "Item not found in inventory."

    elif command.startswith("roll"):
        action = command.split(maxsplit=1)[-1]
        if action == "attack" and current_enemy:
            return roll_attack()
        else:
            return "Invalid roll command or no enemy present."

    else:
        return f"Unknown command: {command}"

def generate_enemy(level):
    enemy_names = ['Goblin', 'Orc', 'Troll', 'Bandit', 'Dark Mage']
    enemy = {
        'name': random.choice(enemy_names),
        'hp': random.randint(30, 60) + level * 10,
        'strength': random.randint(10, 20) + level * 2,
        'defense': random.randint(5, 10) + level
    }
    return enemy

def roll_attack():
    global player, current_enemy
    attack_roll = random.randint(1, 20) + player['strength']
    defense_roll = random.randint(1, 20) + current_enemy['defense']

    if attack_roll >= defense_roll:
        damage = max(0, attack_roll - defense_roll)
        current_enemy['hp'] -= damage
        result = f"You hit the {current_enemy['name']} for {damage} damage! Enemy HP: {current_enemy['hp']}"
        if current_enemy['hp'] <= 0:
            result += "\nEnemy defeated!"
            xp_gain = current_enemy['strength'] * 5
            player['xp'] += xp_gain
            current_enemy = None
            result += f"\nGained {xp_gain} XP."
            if player['xp'] >= player['level'] * 50:
                level_up()
                result += f"\nYou leveled up! Now level {player['level']}."
        else:
            result += enemy_attack()
    else:
        result = f"Your attack missed the {current_enemy['name']}!"
        result += enemy_attack()
    return result

def enemy_attack():
    global player, current_enemy
    enemy_roll = random.randint(1, 20) + current_enemy['strength']
    player_defense = random.randint(1, 20) + player['defense']

    if enemy_roll > player_defense:
        damage = enemy_roll - player_defense
        player['hp'] -= damage
        return f"\nThe {current_enemy['name']} hits you for {damage} damage! Your HP: {player['hp']}"
    else:
        return f"\nYou dodged the {current_enemy['name']}'s attack!"

def find_treasure():
    global player
    treasures = ['Steel Sword', 'Chainmail Armor', 'Potion', 'Gold']
    item = random.choice(treasures)
    if item == 'Gold':
        gold_amount = random.randint(10, 50)
        player['gold'] += gold_amount
        return f"You found {gold_amount} gold!"
    player['inventory'].append(item)
    return f"You found a {item}!"

def trigger_trap():
    global player
    damage = random.randint(10, 30)
    player['hp'] -= damage
    return f"You triggered a trap and took {damage} damage! Your HP: {player['hp']}"

def meet_merchant():
    global player
    item = 'Potion'
    player['inventory'].append(item)
    return "A friendly merchant gave you a Potion."

def special_event():
    global player
    event = random.choice(['festival', 'training'])
    if event == 'festival':
        player['hp'] = player['max_hp']
        return "You attended a festival and fully restored your HP!"
    elif event == 'training':
        player['xp'] += 20
        return "You trained hard and gained 20 XP!"

def level_up():
    global player
    player['level'] += 1
    player['strength'] += 3
    player['dexterity'] += 3
    player['defense'] += 2
    player['max_hp'] += 20
    player['hp'] = player['max_hp']

# WIZARD ADVENTURE
wizard_active = False
player = {}
location = "start"

def wizard_start():
    global wizard_active, player, location
    wizard_active = True
    player = {'inventory': [], 'hp': 100}
    location = "forest"
    return ("Welcome to 'The Cavern of the Evil Wizard'!\n"
            "You find yourself in a dark forest.\n"
            "Commands: 'look', 'go north', 'go south', 'inventory', 'take', 'use [item]', 'attack'.")

def wizard_action(command):
    global location, player, wizard_active
    if not wizard_active:
        return "You must start the game first! Type 'wizard start'."

    cmd = command.lower().split()

    if cmd[0] == "look":
        return describe_location()

    elif cmd[0] == "go":
        if len(cmd) < 2:
            return "Go where?"
        return move_player(cmd[1])

    elif cmd[0] == "inventory":
        inv = ', '.join(player['inventory']) or "nothing"
        return f"You are carrying: {inv}."

    elif cmd[0] == "take":
        return take_item()

    elif cmd[0] == "use":
        if len(cmd) < 2:
            return "Use what?"
        return use_item(cmd[1])

    elif cmd[0] == "attack":
        return attack_wizard()

    else:
        return "Command not understood."

def describe_location():
    descriptions = {
        "forest": "Tall trees surround you. Paths lead north and south. You notice something shining.",
        "lake": "A serene lake. There is something floating in the water.",
        "cave": "A dark cave entrance. An ominous feeling overwhelms you. The Evil Wizard resides here.",
        "clearing": "A sunny clearing. There is a rusty sword lying on the ground."
    }
    return descriptions.get(location, "You see nothing of interest.")

def move_player(direction):
    global location
    paths = {
        "forest": {"north": "lake", "south": "clearing"},
        "lake": {"south": "forest"},
        "clearing": {"north": "forest", "east": "cave"},
        "cave": {"west": "clearing"}
    }
    if direction in paths.get(location, {}):
        location = paths[location][direction]
        return f"You moved {direction} to the {location}."
    else:
        return "You can't go that way."

def take_item():
    global player, location
    items = {"forest": "amulet", "lake": "magic potion", "clearing": "rusty sword"}
    if location in items and items[location] not in player['inventory']:
        player['inventory'].append(items[location])
        return f"You took the {items[location]}."
    else:
        return "Nothing here to take."

def use_item(item):
    global player
    if item in player['inventory']:
        if item == "magic potion":
            player['hp'] = 100
            player['inventory'].remove(item)
            return "You drank the magic potion and restored your health."
        elif item == "amulet":
            return "The amulet glows faintly. It might protect you."
        else:
            return "Nothing happens."
    else:
        return "You don't have that item."

def attack_wizard():
    global player, location, wizard_active
    if location != "cave":
        return "There's nothing here to attack."

    if "rusty sword" not in player['inventory']:
        player['hp'] -= 50
        if player['hp'] <= 0:
            wizard_active = False
            return "You attacked barehanded and were defeated by the Evil Wizard. Game over."
        return f"You have no weapon! The Wizard injures you badly. Your HP: {player['hp']}"

    attack_roll = random.randint(1, 20)
    if attack_roll > 10:
        wizard_active = False
        return "You strike the Evil Wizard down with your sword! Victory is yours!"
    else:
        player['hp'] -= 50
        if player['hp'] <= 0:
            wizard_active = False
            return "You missed! The Evil Wizard defeats you. Game over."
        return f"You missed! The Wizard counters. Your HP: {player['hp']}"
