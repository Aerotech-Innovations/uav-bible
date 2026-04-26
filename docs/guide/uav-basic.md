# UAV 基础知识

无人机（UAV，Unmanned Aerial Vehicle）是一类无需机载人员操控的航空器，通过地面站遥控或机载计算机自主飞行。本页覆盖多旋翼无人机的核心概念，是理解后续所有技术文档的基础。

## 关键无人机技术

现代无人机系统横跨六大技术域，理解各域的职责边界有助于在团队内定位工作。

### 飞控嵌入式开发

飞控嵌入式开发是无人机系统的核心工程领域，负责将传感器信号转化为电机指令。

**典型工作内容**

| 层次 | 内容 |
|------|------|
| 硬件抽象层（HAL） | 驱动 UART、SPI、I²C、CAN 外设，对接 IMU、气压计、GPS |
| 实时操作系统（RTOS） | 任务调度、中断管理；PX4 基于 NuttX，ArduPilot 基于 ChibiOS |
| 飞行控制算法 | 姿态估计（EKF2）、PID 控制器、混控（Mixer） |
| 固件定制与移植 | 针对新机型调整参数文件（`.params`）、混控配置、启动脚本 |

**主流固件**：PX4 Autopilot、ArduPilot（ArduCopter）

::: tip
PX4 的模块化架构（uORB 消息总线）使得新传感器和控制算法可以作为独立模块插入，无需修改核心代码。参考 [PX4 系统架构](./px4-architecture)。
:::

---

### 传感器技术

传感器为飞控提供飞行状态的全量感知，是状态估计精度的根基。

**核心传感器栈**

| 传感器 | 物理量 | 典型器件 |
|--------|--------|----------|
| 加速度计 + 陀螺仪（IMU） | 线加速度、角速率 | ICM-42688-P、BMI088 |
| 气压计 | 静压 → 高度 | MS5611、BMP388 |
| 磁力计 | 地磁场 → 航向 | IST8310、RM3100 |
| GNSS | 经纬度、速度、时间 | u-blox F9P（RTK）、M8N |
| 光流 | 地面相对速度（室内） | PX4FLOW、PMW3901 |
| 激光测距（LiDAR） | 精确高度 / 避障 | TF-Luna、Benewake CE30 |
| 深度相机 | 三维点云 | Intel RealSense D435i |

::: warning 传感器融合要点
单一传感器均存在漂移或遮蔽问题（GPS 在室内失效、磁力计受干扰）。飞控通过 **扩展卡尔曼滤波（EKF2）** 融合多源数据，冗余设计（双 IMU）是工业级无人机的基本要求。
:::

---

### 导航技术

导航解决"无人机在哪、要去哪"的问题，是自主飞行的前提。

**导航技术栈**

```
定位（Where am I?）
  ├── GNSS（室外，米级）
  ├── RTK-GNSS（室外，厘米级）
  ├── 视觉里程计（VIO，室内/GNSS 拒止）
  └── 激光 SLAM（室内，厘米级）

路径规划（How to get there?）
  ├── 全局规划：A*、Dijkstra、航点序列
  └── 局部规划：DWA、势场法、RRT*

避障（What's in the way?）
  ├── 感知：深度相机、激光雷达、超声波
  └── 决策：重新规划 / 悬停 / 返航
```

::: info 室内导航
室内环境无 GPS 信号，常用方案：**激光 SLAM**（Cartographer、RTAB-Map）或 **视觉惯性里程计**（VINS-Mono、ORB-SLAM3）结合光流传感器实现稳定悬停。
:::

---

### 自主控制技术

自主控制技术决定无人机在无人干预下的决策和行为能力。

**自主等级（参考 ASTM F3269）**

| 等级 | 描述 | 示例 |
|------|------|------|
| Level 1 | 飞手全权操控 | 手动模式 |
| Level 2 | 飞控辅助稳定 | Stabilized / Altitude 模式 |
| Level 3 | 飞控执行高层指令 | Position / Mission 模式 |
| Level 4 | 机载计算机自主决策 | Offboard + ROS2 任务编排 |
| Level 5 | 完全自主，无需人在回路 | 集群、超视距 BVLOS |

**关键技术模块**

- **任务规划**：航点任务（`.plan` 文件）、Geofence、RTL（Return-to-Launch）
- **Offboard 控制**：通过 MAVLink 或 ROS2（MAVROS / px4_ros_com）向飞控发送位置 / 速度 / 姿态设定点
- **机载计算**：Jetson Orin NX、Raspberry Pi 5 运行感知与决策算法
- **集群协同**：分布式任务分配、冲突消解、编队控制

::: warning BVLOS 合规
超视距（Beyond Visual Line of Sight）飞行在中国大陆须取得专项许可，技术上需具备可靠的链路冗余和指挥控制（C2）能力。
:::

---

### 动力技术

动力系统决定无人机的载重、航时和机动性，是机械设计与电气设计的交汇点。

**动力链**

```
电池（LiPo / Li-ion）→ 电调（ESC）→ 无刷电机（BLDC）→ 螺旋桨
```

**选型关键参数**

| 组件 | 关键参数 | 说明 |
|------|----------|------|
| 电池 | S 数、容量（mAh）、C 率 | 6S 50C 10000 mAh 适合重载 |
| 电调 | 持续电流（A）、协议 | DSHOT600 推荐用于精确控制 |
| 电机 | KV 值、定子尺寸 | 低 KV + 大桨 = 高效率长航时 |
| 螺旋桨 | 直径（英寸）、螺距 | 桨径↑推力↑，螺距↑速度↑效率↓ |

**航时估算（经验公式）**

$$
T_{flight}(\text{min}) = \frac{\text{电池容量(mAh)} \times 60}{\text{平均电流(mA)}}
$$

悬停电流约为最大推力电流的 **50%**，实际航时还需扣除 **20%** 安全余量（不建议放电至 3.5 V/节以下）。

::: danger 热管理
大电流持续放电会使电池和电调温度骤升。工业场景应在电调上加装温度传感器，超过 **80°C** 时触发降功率保护。
:::

---

### 地面站技术

地面站（GCS，Ground Control Station）是飞手与无人机之间的人机界面，承担任务规划、实时监控和数据回传职责。

**功能架构**

```
地面站软件（QGroundControl / Mission Planner）
  ├── 飞行前：载入任务、检查参数、设置 Geofence
  ├── 飞行中：实时遥测（位置、姿态、电池、链路质量）
  └── 飞行后：日志下载（.ulg / .bin）、飞行回放分析

通信链路
  ├── 数传电台（433/915 MHz，SiK / RFD900）：低带宽指令链路
  ├── 4G/5G LTE（远距离 BVLOS）
  └── 卫星（极端远程，高延迟）
```

**MAVLink 遥测关键消息**

| 消息 | 内容 |
|------|------|
| `HEARTBEAT` | 系统状态、飞行模式 |
| `GLOBAL_POSITION_INT` | GPS 位置、高度、速度 |
| `ATTITUDE` | 横滚、俯仰、偏航角 |
| `BATTERY_STATUS` | 电压、电流、剩余容量 |
| `MISSION_ITEM_INT` | 航点定义 |

更多协议细节见 [MAVLink 协议](./mavlink)。

::: tip 自定义地面站
团队可基于 **MAVLink Python 库**（`pymavlink`）或 **MAVSDK** 快速开发专用地面站，实现与业务系统（任务调度、数据平台）的深度集成。
:::

## 专业术语

| 术语 | 全称 / 原文 | 释义 |
|------|------------|------|
| **Aircraft** | Aircraft | 航空器的通称，涵盖固定翼、旋翼、飞艇等一切依靠空气动力升空的飞行器。UAV 是其子集。 |
| **UAV** | Unmanned Aerial Vehicle | 无人驾驶航空器，机上无飞行员，由地面站遥控或机载计算机自主控制飞行。 |
| **Quadcopter** | Quadrotor Helicopter | 四旋翼无人机，四个电机呈"X"或"+"形布局，是最常见的多旋翼构型。对角电机同向旋转以抵消反扭矩。 |
| **RTL** | Return-to-Launch | 自动返航模式。触发条件：飞手主动切换、遥控信号丢失或电量不足。无人机爬升至安全高度后自主飞回起飞点并降落。 |
| **ArduPilot** | ArduPilot Autopilot | 开源飞行控制固件项目，支持多旋翼（ArduCopter）、固定翼（ArduPlane）、无人车（ArduRover）等平台，运行于 ChibiOS/Linux。 |
| **Pixhawk** | Pixhawk FMU | Pixhawk 标准由 PX4 项目定义，是一系列开源飞控硬件的统称（Pixhawk 6C、Cube Orange 等），可运行 PX4 或 ArduPilot 固件。 |
| **QGC** | QGroundControl | 跨平台开源地面站软件，支持实时遥测监控、任务规划、参数调整和固件烧录，是 PX4 / ArduPilot 生态的标准 GCS。 |
| **ROS 2** | Robot Operating System 2 | 机器人操作系统第二代，提供分布式节点通信（DDS）、话题/服务/动作接口。无人机自主飞行的标准中间件，用于感知、规划和控制算法的集成。 |
| **Gazebo** | Gazebo Sim（原 Ignition Gazebo） | 开源机器人仿真器，提供物理引擎、传感器模型和 ROS 2 集成。PX4 SITL 的默认仿真后端，可在无实体机的情况下验证飞行算法。 |
| **MAVLink** | Micro Air Vehicle Link | 轻量级无人机通信协议（二进制序列化），定义飞控与地面站、机载计算机之间交换的消息格式（心跳、位置、指令等）。详见 [MAVLink 协议](./mavlink)。 |
| **uORB** | Micro Object Request Broker | PX4 内部的异步发布/订阅消息总线。各飞控模块（传感器驱动、估计器、控制器）通过 uORB topic 解耦通信，无需直接函数调用。 |
| **MAVROS** <Badge type="warning" text="Deprecated" /> | MAVLink + ROS | ROS / ROS 2 功能包，将 MAVLink 消息桥接为 ROS 话题和服务。PX4 v1.14+ 已不推荐，官方转向 uXRCE-DDS 方案。目前主要用于 **ArduPilot + ROS 2** 或遗留 PX4 项目。 |
| **uXRCE-DDS** | micro XRCE-DDS（Micro eXtremely Resource Constrained Environments DDS） | PX4 v1.14+ 官方推荐的 ROS 2 集成方案。在飞控上运行 `MicroXRCEAgent` 客户端，通过 DDS 协议直接将 uORB topic 桥接为 ROS 2 topic，无需经过 MAVLink 转换，延迟更低、带宽更大。配套包：`px4_ros_com`（接口库）+ `px4_msgs`（消息定义）。 |
| **Offboard** | Offboard Control Mode | PX4 飞行模式之一。飞控将控制权交给外部计算机（机载 Jetson / PC），由外部节点以固定频率（≥ 2 Hz）发送位置 / 速度 / 姿态设定点，适用于自主任务执行。 |

::: info
上表术语在本知识库后续文档中频繁出现，建议在阅读其他页面前先熟悉这些概念。
:::

## 飞控介绍

Pixhawk 系列是开源无人机生态中最主流的飞控硬件标准，由 PX4 项目定义接口规范，由 Holybro 等厂商生产。以下五款覆盖了从入门到工业级的常见选型。

### 快速对比

| 型号 | MCU | 主频 | IMU 冗余 | 连接器 | 定位 | 状态 |
|------|-----|------|---------|--------|------|------|
| Pixhawk 2.4.8 | STM32F427 (M4F) | 168 MHz | 双 IMU | DF13 | 入门 / 教学 | <Badge type="warning" text="Legacy" /> |
| Pixhawk 4 | STM32F765 (M7) | 216 MHz | 双 IMU | JST-GH | 通用研发 | <Badge type="info" text="Mature" /> |
| Pixhawk 4 Mini | STM32F765 (M7) | 216 MHz | 双 IMU | JST-GH | 小型机体 | <Badge type="info" text="Mature" /> |
| Pixhawk 6C | STM32H743 (M7) | 480 MHz | 三 IMU | JST-GH | 研发 / 商业 | <Badge type="tip" text="Current" /> |
| Pixhawk 6X | STM32H753 (M7) | 480 MHz | 三 IMU | JST-GH | 工业 / 高可靠 | <Badge type="tip" text="Current" /> |

---

### Pixhawk 2.4.8 <Badge type="warning" text="Legacy" />

最广泛流通的克隆飞控，由 mRo、Radiolink、CUAV 等厂商大量生产，价格低廉。

**硬件规格**

| 项目 | 参数 |
|------|------|
| MCU | STM32F427VIT6，Cortex-M4F，**168 MHz** |
| RAM | 256 KB SRAM |
| Flash | 2 MB |
| 主 IMU | MPU-6000（加速度计 + 陀螺仪） |
| 副 IMU | MPU-9250 或 LSM303D + L3GD20（随厂商不同） |
| 气压计 | MS5611 |
| 连接器 | **DF13**（锁紧力弱，易松动，主要缺点） |
| PWM 输出 | Main ×8 + AUX ×6 |
| 尺寸 / 重量 | 81 × 50 × 16 mm / 约 38 g（含外壳） |

::: warning 选型注意
DF13 连接器在振动环境下容易脱落，市场上存在大量质量参差不齐的克隆板。如用于真机，建议在连接器处点胶固定，并使用可靠来源的板子。新项目不建议选用。
:::

**适用场景**：课程教学、低成本原型验证、仿真开发（无需真机时可用克隆板烧固件）

---

### Pixhawk 4 <Badge type="info" text="Mature" />

Holybro 于 2018 年推出，升级到 Cortex-M7 内核，是 PX4 生态成熟度最高的通用板之一。

**硬件规格**

| 项目 | 参数 |
|------|------|
| MCU | STM32F765VIT6，Cortex-M7，**216 MHz** |
| RAM | 512 KB SRAM |
| Flash | 2 MB |
| 主 IMU | ICM-20689（振动隔离安装） |
| 副 IMU | BMI055 |
| 气压计 | MS5611 × 2 |
| 连接器 | **JST-GH**（锁紧可靠，业界标准） |
| PWM 输出 | Main ×8（FMU）+ AUX ×8（经 I/O 协处理器） |
| 接口 | UART ×5、I²C ×3、SPI ×3、CAN ×2 |
| 尺寸 / 重量 | 44 × 84 × 12 mm / **15.8 g** |

::: tip
Pixhawk 4 是目前社区教程、参数调试指南覆盖最完整的型号，遇到问题容易找到参考。与 GPS M8N 套件搭配为标准开发套装。
:::

**适用场景**：团队研发主力机、算法验证、学生竞赛

---

### Pixhawk 4 Mini <Badge type="info" text="Mature" />

Pixhawk 4 的缩减版，保留相同 MCU，裁减部分接口，适合 250–450 mm 级机体。

**硬件规格**

| 项目 | 参数 |
|------|------|
| MCU | STM32F765VIT6，Cortex-M7，**216 MHz** |
| RAM | 512 KB SRAM |
| 主 IMU | ICM-20689（振动隔离） |
| 副 IMU | ICM-20602 |
| 气压计 | MS5611 |
| 连接器 | JST-GH |
| PWM 输出 | Main ×8（无独立 AUX I/O 处理器） |
| 接口 | UART ×4、I²C ×3、SPI ×1、CAN ×1（较 PX4 缩减） |
| 尺寸 / 重量 | 38 × 55 × 15.5 mm / **37.2 g** |

::: info 与 Pixhawk 4 的取舍
Mini 去掉了独立 I/O 处理器，AUX 口数量减少；CAN 只保留 1 路。如果机体需要多路 CAN 外设（如多个 UAVCAN ESC），应选完整版 Pixhawk 4 或更新型号。
:::

**适用场景**：尺寸受限的小型多旋翼、FPV 竞速改装、轻量化载具

---

### Pixhawk 6C <Badge type="tip" text="Current" />

基于 **Pixhawk Autopilot Bus（PAB）** 标准的当代主流型号，采用 STM32H7 系列，计算性能大幅提升。

**硬件规格**

| 项目 | 参数 |
|------|------|
| MCU | STM32H743IIK6，Cortex-M7，**480 MHz** |
| RAM | 1 MB DTCM RAM |
| Flash | 2 MB |
| IMU 1 | ICM-42688-P（振动隔离，主传感器） |
| IMU 2 | ICM-20649-S（高量程，抗饱和） |
| IMU 3 | BMI055 |
| 气压计 | BMP388 × 2 |
| 连接器 | JST-GH |
| 接口 | UART ×6、CAN ×2、I²C ×3、SPI ×4 |
| 特性 | IMU 温度补偿、硬件振动隔离、PAB 底板可扩展 |

::: tip 三冗余 IMU 的价值
三 IMU 配置允许飞控在单传感器故障时自动切换，同时对三路数据做一致性检查（投票机制），显著提升估计精度和系统可靠性。
:::

**适用场景**：商业无人机研发、高精度任务（测绘、巡检）、作为团队新项目的默认选型

---

### Pixhawk 6X <Badge type="tip" text="Current" />

Pixhawk 系列当前旗舰，在 6C 基础上增加工业级特性，面向高可靠性和高带宽载荷场景。

**硬件规格**

| 项目 | 参数 |
|------|------|
| MCU | STM32H753IIK6，Cortex-M7，**480 MHz** |
| RAM | 1 MB |
| Flash | 2 MB |
| IMU 1 | ICM-42688-P × 2（双主传感器，振动隔离） |
| IMU 3 | ICM-20649-S |
| 气压计 | ICP20100 + BMP388（双冗余，不同厂商） |
| 连接器 | JST-GH |
| 接口 | UART ×6、CAN ×2、**以太网（10/100 Mbps）**、I²C ×3、SPI ×4 |
| 特性 | 硬件安全启动（H753 TrustZone）、以太网接口、更高 I/O 冗余 |

::: info 以太网接口的意义
板载以太网允许机载计算机（Jetson Orin）通过高带宽链路与飞控通信，适合实时视频流、点云数据等大带宽场景，也是未来 MAVLink 2 over Ethernet 方案的硬件基础。
:::

::: warning 选型建议
6X 功能最强但价格最高。若不需要以太网或极致冗余，**Pixhawk 6C 在大多数研发场景下已足够**，性价比更高。
:::

**适用场景**：工业级无人机、需要以太网载荷连接、安全认证要求高的商业产品

---

#### Pixhawk 6X 接口详解

![Pixhawk 6X Wiring Diagram](/images/pixhawk6x_wiring_diagram.png)

> 官方接线图：[Holybro Sample Wiring Diagram](https://docs.holybro.com/autopilot/pixhawk-6x/sample-wiring-diagram) · [PX4 Wiring Quick Start](https://docs.px4.io/main/en/assembly/quick_start_pixhawk6x)

所有接口均采用 **JST-GH 1.25 mm Pitch** 连接器（POWER 口除外，使用 2.00 mm Pitch CLIK-Mate）。

**电源接口**

| 接口 | 针数 | 连接器 | 功能 |
|------|------|--------|------|
| `POWER1` | 6 | 2.00 mm CLIK-Mate | 主电源输入，接电源模块（PM02D）；引脚：VCC × 2 / I²C SCL / I²C SDA / GND × 2 |
| `POWER2` | 6 | 2.00 mm CLIK-Mate | 冗余电源输入，接第二路电源模块；与 POWER1 同引脚定义 |
| `USB` | — | USB-C | 调试 / 固件烧录供电（4.75–5.25 V），不可用于飞行供电 |

::: warning 供电要求
VCC 须能持续输出 **≥ 3 A @ 5.2 V**。强烈建议同时接入 POWER1 和 POWER2 实现冗余供电，单路掉电时飞控自动切换，不中断飞行。
:::

**电机 / 舵机输出**

| 接口 | 针数 | PX4 映射 | 功能 |
|------|------|---------|------|
| `I/O PWM OUT` | 16 | MAIN 1–8 | 接电调（ESC）信号线 + GND；驱动主旋翼电机 |
| `FMU PWM OUT` | 16 | AUX 1–8 | 接舵机信号线；**舵机需外接独立 5 V BEC 供电**，FMU 口不提供舵机电源 |

::: info MAIN vs AUX
MAIN 输出由专用 **I/O 协处理器**（STM32F100）驱动，在 FMU 死机时仍可保持输出，安全性更高；AUX 由 FMU 直接驱动，延迟更低，适合需要高频率 PWM 或 DSHOT 的场景。
:::

**GPS / 罗盘**

| 接口 | 针数 | 功能 |
|------|------|------|
| `GPS1` | 10 | 主 GPS 口；连接 M8N / M9N GPS（含罗盘、安全开关、蜂鸣器、LED）；协议：UART + I²C |
| `GPS2` | 6 | 副 GPS 口；接第二路 GNSS 模块（仅 UART，无罗盘/LED） |

**遥控 / 遥测**

| 接口 | 功能 |
|------|------|
| `RC IN` | 接 PPM 或 S.BUS 接收机（S.BUS 直连；PPM 需编码器模块） |
| `DSM / SBUS RC` | 接 Spektrum DSM / S.BUS 接收机（与 RC IN 二选一，视接收机协议） |
| `TELEM1` | 主数传口，接地面站电台（SiK / RFD900）；限流 1.5 A，可为电台供电 |
| `TELEM2` | 副数传口（UART5），接机载计算机或第二路地面站 |
| `TELEM3` | 第三数传口（USART3），扩展用途（如接 Companion Computer 的 MAVLink） |

**高速 / 扩展接口**

| 接口 | 功能 |
|------|------|
| `ETH`（以太网） | 100 Mbps，接 Jetson / 机载计算机；支持 MAVLink over UDP，高带宽数据传输 |
| `CAN1 / CAN2` | UAVCAN / DroneCAN 总线；接 CAN ESC、GPS、空速计等 CAN 外设；两路相互独立 |
| `I2C` | 通用 I²C 扩展，接气压计、罗盘、距离传感器等 I²C 外设 |
| `SPI（SPI5）` | 外部传感器总线，含 2 路片选（CS），接高速传感器 |

**调试接口**

| 接口 | 针数 / 型号 | 功能 |
|------|------------|------|
| `DEBUG` | 10 pin，JST SM10B | SWD 调试（烧录 / 单步调试）+ SERIAL CONSOLE（NuttX Shell）；开发阶段必备 |
| `SD Card` | MicroSD | 飞行日志（`.ulg`）、任务文件、UAVCAN 固件升级 |

**典型整机接线拓扑**

```
                    ┌─────────────────────────────────┐
                    │         Pixhawk 6X              │
  电源模块(PM02D) ──┤ POWER1 / POWER2                 │
  主 GPS(M9N) ──────┤ GPS1 (10-pin)                   │
  副 GPS(M8N) ──────┤ GPS2 (6-pin)                    │
  数传电台 ─────────┤ TELEM1                          │
  机载计算机 ───────┤ TELEM2 / ETH                    │
  接收机(S.BUS) ────┤ RC IN                           │
  CAN ESC ──────────┤ CAN1                            │
  I²C 传感器 ───────┤ I2C                             │
                    │                                 │
                    │ I/O PWM OUT ── 电调 M1–M8       │
                    │ FMU PWM OUT ── 舵机 S1–S8       │
                    └─────────────────────────────────┘
```


