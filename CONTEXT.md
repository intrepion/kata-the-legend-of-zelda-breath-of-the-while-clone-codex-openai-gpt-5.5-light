# Wildreach Adventure

Wildreach Adventure is a browser-playable, original open-air adventure inspired by the design grammar of The Legend of Zelda: Breath of the Wild. Its domain language centers on third-person traversal, visible destinations, and compact authored discoveries inside a bounded wilderness.

## Language

**Open-Air Adventure**:
A third-person exploration game where visible destinations, traversal freedom, and environmental problem solving define the experience.
_Avoid_: Zelda clone, action RPG, sandbox

**Region**:
The bounded playable wilderness that contains landmarks, traversal challenges, encounters, and shrines.
_Avoid_: Level, map, zone

**Plateau Slice**:
The first playable vertical slice: a bounded region with a tower, authored traversal, an optional enemy camp, and one shrine that awards a spirit token.
_Avoid_: MVP, demo, first level

**Bowl Upland**:
The Plateau Slice terrain shape: a readable basin with high and low routes arranged around a central tower.
_Avoid_: Open world, terrain chunk, overworld

**Landmark**:
A visible destination that attracts the player through silhouette, height, motion, light, smoke, or contrast.
_Avoid_: Point of interest, marker, waypoint

**Compass Pip**:
A soft directional hint for a discovered landmark after tower activation.
_Avoid_: Quest marker, objective arrow, waypoint

**Vista**:
A high or open view that confirms progress, previews future destinations, or closes a traversal sequence.
_Avoid_: Viewpoint, overlook, scenic spot

**Final Vista**:
The closing destination reached after shrine completion that confirms the Plateau Slice is complete.
_Avoid_: End screen, finish line

**Tower**:
A high landmark that reveals region knowledge and gives the player a strategic view of the surrounding wilderness.
_Avoid_: Map unlock, beacon

**Tower Reveal**:
The tower activation moment that exposes shrine light, camp smoke, climbable route hints, and a minimal region sketch.
_Avoid_: Map completion, objective unlock

**Map Sketch**:
A minimal parchment-style overlay shown after tower activation with the tower, shrine, camp, recovery point, and player marker.
_Avoid_: Full map, minimap, navigation menu

**Glider**:
The traversal tool earned at the tower that lets the player cross height and distance after leaving the summit.
_Avoid_: Parachute, sailcloth, flying

**Shrine**:
A compact authored challenge that tests traversal, physics, or environmental reasoning and rewards long-term progression.
_Avoid_: Dungeon, puzzle room, level

**Physics Shrine**:
A shrine centered on blocks, pressure plates, ramps, and spatial reasoning.
_Avoid_: Physics level, block puzzle

**Ruin Chamber**:
The same-scene outdoor-adjacent shrine space that contains the physics shrine challenge.
_Avoid_: Interior dungeon, separate scene

**Pressure Plate**:
A shrine mechanism that responds to a block or player weight and opens the path toward the spirit token.
_Avoid_: Button, switch

**Stamina**:
The shared resource that limits sustained traversal verbs and makes route choice meaningful.
_Avoid_: Energy, endurance meter

**Stamina Wheel**:
The compact HUD element that communicates remaining stamina during climbing, gliding, and sprinting.
_Avoid_: Stamina bar, energy meter

**Climbable Surface**:
An authored cliff face, ruin wall, or other surface that supports climbing in the Plateau Slice.
_Avoid_: Any wall, climb zone

**Climbing**:
The traversal verb entered near a climbable surface that lets the adventurer move vertically while stamina drains.
_Avoid_: Wall crawling, scaling

**Gliding**:
The traversal verb started while airborne after the glider is earned, letting the adventurer trade height for distance.
_Avoid_: Flying, parachuting

**Traversal Verb**:
A player movement action that changes how the region can be crossed, such as climbing, gliding, jumping, or swimming.
_Avoid_: Move, ability, control

**Context Prompt**:
A short on-screen prompt that appears only when the adventurer can perform a nearby interaction.
_Avoid_: Tutorial text, instruction panel

**Plateau Complete**:
The completion state reached after the shrine is finished, a spirit token is earned, and the final vista is reached.
_Avoid_: Game over, quest complete, victory screen

**Enemy Camp**:
A small hostile site that creates risk, rewards observation, and offers optional combat within the region.
_Avoid_: Combat arena, mob pack

**Scrap Scout**:
A simple original enemy with patrol, alert, chase, and attack behavior in an enemy camp.
_Avoid_: Bokoblin, monster, raider

**Adventurer**:
The original player character: a cel-shaded traveler with a cloak, pack, short sword, and glider rig.
_Avoid_: Link, hero, player pawn

**Weapon Pickup**:
A lightweight piece of gear found or earned in the region that changes the player's combat options without creating a durability economy.
_Avoid_: Loot, equipment system, inventory item

**Recovery Point**:
A tower or shrine entrance where the adventurer resumes after health loss.
_Avoid_: Checkpoint, save point, respawn

**Slice Progress**:
The locally persisted completion state for tower activation, glider ownership, shrine completion, spirit tokens, and the latest recovery point.
_Avoid_: Save file, account progress, profile

**Spirit Token**:
The progression reward earned from completing a shrine.
_Avoid_: Orb, shrine reward, collectible
