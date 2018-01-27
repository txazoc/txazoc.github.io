---
layout: mc
title:  指令
---

#### /clear

```java
/clear <player> [item]
```

#### /clone

```java
/clone <x,y,z> <x,y,z> <x,y,z>
```

#### /gamerule

游戏规则

```java
/gamerule keepInventory true    // 死亡不掉落
/gamerule mobGriefing false     // 禁用怪物破坏
```

#### /gamemode

游戏模式

```java
/gamemode 0 [player]    // 生存
/gamemode 1 [player]    // 创造
/gamemode 2 [player]    // 冒险
```

#### /difficulty

游戏难度

```java
/difficulty 0   // 和平
/difficulty 1   // 简单
/difficulty 2   // 普通
/difficulty 3   // 困难
```

#### /kill

杀死玩家

```java
/kill
```

#### /locate

定位最近的自然建筑

```java
/locate endcity     // 末路之地有效
/locate fortress    // 地狱堡垒
/locate mansion     // 林地府邸
/locate mineshaft   // 废弃矿井
/locate monument    // 海底遗迹
/locate stronghold  // 要塞
/locate temple      // 神庙
/locate village     // 村庄
```

#### /fill

填充命令方块

```java
/give @P command_block          // 给予命令方块
/fill 0 0 1  170 10 10 stone    // 填充命令方块
```

#### /spawnpoint

```java
/spawnpoint Chaugod 0 10 0
```
