# DungeonKeeperTD

## Overview
You will be controlling the inside of a dungeon, while enemies try breach and get from the entrance doors all the way to the dungeons heart. If a enemy achives their goal to get there your dungeon heart will lose power, if it is reduced to 0 you will lose. You can protect yourself by adding traps and buildings to fight off these enemies. However this costs gold which is only achieved by destroying a enemy. Some enemys may choose to go for your gold stash instead of your dungeon heart.

## Rules
1. Enemys will enter the dungeon to attack your dungeon heart if it is reduced to 0 you lose.
2. Not all enemys will prioritize your dungeon heart some will target your gold stash. (if time)
3. Not all enemys have the same amount of health or move at the same speed.
4. Build buildings and traps around your dungeon to destroy the invaders.
5. buildings and traps will cost gold relative to their dependency/effectivness.
6. If you survive round 10 then you will have repelled the invaders and you win. 

## Wireframes
![startGame](https://i.imgur.com/MN4pIUF.jpg =100x100)

1. Main menu, player can choose to play game or quit (options if time)

![ingame](https://i.imgur.com/Ep3Sh35.jpg =100x100)
![ingameTwo](https://i.imgur.com/wh9tydg.jpg =100x100)

2. ingame enemies will come from the right, pushing left to get to either the gold or dungeon heart. Players can click boxes in the left window to select traps and put them down.

![victory](https://i.imgur.com/MMHjgdb.jpg =100x100)

3. If you survive all 10 rounds the game will end and you will win.
<img src="https://i.imgur.com/oHTz8dE.jpg" width="300" height="300">

4. If youre dungeon heart reaches 0 the game will end and you will lose.

## User Stories

When I press play the menu screen will dissapear and i will be in the game
When the game starts enemies start spawning at the right side of the dungeon and walk towards the left
In my menu I started with a 500 gold
I click on my traps/buildings and click and the trap is placed at the position
when i place a trap its cost is removed from my current gold
when the trap triggers and collides with an enemy the enemy is destroyed and i receive a certain amount of gold
If a enemy reaches my dungeon heart alive I lose one health
If 10 enemies in total reach my dungeon heart alive I lose the game.
If my dungeon heart is > 0 at the end of round 10 I am given the victory screen.

## MVP

enemy squares spawn at the right of the map when round starts
move along a pre-determined path to try and get to your dungeon heart
trap squares will trigger on a timer if enemy is colliding when trap triggers is dies and you gold count increases
if enemy square collides with dungeon heart square your dungeon heart loses a point
if enemys in round  === 0 stop round. start building timer (20 seconds or something) at the end of this start next round

## Stretch Goals

Art, music, new mechanics
