# Battle Card: Market Garden 1944

---

## 游戏概述

在盟军的「市场花园行动」期间，盟军试图夺取荷兰的重要桥梁并绕过德军防线。玩家扮演盟军指挥官，必须建立一条从比利时到 Arnhem 的连续补给线。

### 胜利条件

| 结果 | 条件 |
| --- | --- |
| 胜利 | 30 Corps 进入 Arnhem |
| 失败 | 任意盟军单位被消灭（Strength < 1） |
| 失败 | Turn Die > 6 |

---

## 地图结构

4 个关键地点呈线性排列：

```
Belgium
   |
Eindhoven
   |
  Grave
   |
Nijmegen
   |
 Arnhem
```

30 Corps 从 Belgium 出发。

### 数据结构

```json
{
  "name": "Eindhoven",
  "allied_unit": null,
  "german_unit": 3,
  "control": 1
}
```

| 字段 | 含义 |
| --- | --- |
| `allied_unit` | 盟军单位强度 |
| `german_unit` | 德军单位强度 |
| `control` | 1=德军控制, 6=盟军控制, 默认德军控制 |

### 控制判定

每个地点有一个 Control Die，范围 `1`（德军）或 `6`（盟军）。

状态切换：
- 德军强度>盟军：德军控制
- 查表发现结果是： Allied 控制，切换成盟军控制

## 初始设置

### 各地兵力

| 地点 | German Unit | Allied Unit |
| --- | :-: | :-: |
| Arnhem | 2 | 5 |
| Nijmegen | 1 | — |
| Grave | 2 | 6 |
| Eindhoven | 2 | 6 |

### 盟军空降部队

| 单位 | 部署地点 |
| --- | --- |
| 101st Airborne | Eindhoven |
| 82nd Airborne | Grave |
| 1st Airborne | Arnhem |

### 其他

| 项目 | 位置 |
| --- | --- |
| 30 Corps | Belgium |
| Turn Die | Fog（两个面：Clear / Fog） |

---

## 空投修正（Airdrop）

开始游戏时掷 1d6，将修正应用到所有盟军空降单位。

| 骰值 | 修正 |
| --- | :-: |
| 1~2 | -2 |
| 3~4 | -1 |
| 5~6 | 0 |

例：1st Airborne = 5，掷出 2 → 5 - 2 = 3

---

## 游戏回合流程

```
Battle
   ↓
German Reinforcement
   ↓
Allied Advance
   ↓
1st Airborne Reinforcement
   ↓
Advance Turn
```

重复直到胜负产生。

---

## 1. Battle Phase

玩家在每个地点选择攻击（Attack）或防御（Defend），逐个地点结算。

### 战斗优势（Advantage）

比较双方强度，高者获得 Advantage。

```
Allied 4 vs German 2 → Advantage = Allied
```

### Attack Table

| 优势 | 1 | 2,3,4 | 5,6 |
| --- | --- | --- | --- |
| **All**（盟军优势） | -1 Allied | -1 Allied, -1 German, Allied 控制 | -1 German, Allied 控制 |
| **Ger**（德军优势） | -3 Allied | -2 Allied, -1 German | -1 German, Allied 控制 |
| **No**（无优势） | -2 Allied | -1 Allied, -1 German | -1 German, Allied 控制 |

### Defend Table

| 优势 | 1 | 2,3,4 | 5,6 |
| --- | --- | --- | --- |
| **All**（盟军优势） | -1 German, -1 Allied | No Effect | No Effect |
| **Ger**（德军优势） | -2 Allied | -1 Allied | No Effect |
| **No**（无优势） | -1 Allied | -1 Allied, -1 German | -1 German |

### 战斗结果应用

```
Strength -= Loss
```

### 特殊规则

| 阵营 | 规则 |
| --- | --- |
| 德军 | 最小强度 = 1，不能被消灭 |
| 盟军 | Strength < 1 则立即被消灭（游戏失败） |

---

## 2. German Reinforcement

从 Arnhem 开始往下检查，其德军单位 `Strength + 1`。

如果德军被消灭了，无法增援

Only increase the German unit Strength in Nijmegen if Arnhem is under German control.

```
Arnhem → Nijmegen → Grave → Eindhoven
```

例：
```
Nijmegen: German = 2, Control = 1 → German = 3
```

---

## 3. Allied Advance

玩家可移动：30 Corps 或任意盟军单位。

### Airborne Advance

空降部队只能移动到相邻地点。

### 合并规则

若进入已有盟军单位的地点，Strength 相加（最大 6，超过部分损失）。

```
例: 4 + 4 = 6 (损失 2)
```

### 30 Corps Advance

- 只能进入盟军控制的地点（Control = 6）
- 移动进入后，**移除该地点的德军单位**（代表突破成功）

---

## 4. 1st Airborne Reinforcement

掷 1d6，若 `d6 <= Turn Die`，则 1st Airborne +1 Strength，并把 Turn Die 移到 Clear。

此强化只能发生一次，完成后跳过此步骤。

---

## 5. Advance Turn

```
Turn Die += 1
```

---

## 胜利 / 失败判定

| 条件 | 结果 |
| --- | --- |
| 30 Corps 到达 Arnhem | 立即胜利 |
| 任意盟军单位 Strength < 1 | 立即失败 |
| Turn Die > 6 | 立即失败 |
