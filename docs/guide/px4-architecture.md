# PX4 System Architecture

![Flight Controller](/images/px4_arch_fc.svg)

---

## 核心组件说明

| 缩写 | 中文名 | 说明 |
|------|--------|------|
| **GCS** | 地面控制站 | Ground Control Station，运行在地面电脑/平板上的软件（如 QGroundControl），用于规划任务、实时监控飞行状态、调参 |
| **Telemetry Radio** | 数传电台 | 飞机与 GCS 之间的无线通信模块（通常 433/915 MHz），负责双向传输 MAVLink 数据，距离可达数公里 |
| **RC Controller** | 遥控器 | 飞手手持的发射器，拨动摇杆/开关发出控制指令，用于手动飞行或紧急接管 |
| **RC Radio** | RC 接收机 | 安装在飞机上，接收遥控器信号并转成 SBUS/PPM 信号传给飞控 |
| **NuttX OS** | NuttX 实时操作系统 | Pixhawk 飞控上运行的嵌入式 RTOS，提供任务调度、硬件驱动框架，PX4 跑在它上面 |
| **RTPS** | 实时发布-订阅协议 | Real-Time Publish-Subscribe，PX4 与外部计算机（如机载 ROS2）之间的高性能通信协议，现已被 uXRCE-DDS 取代 |
| **MAVLink** | 微型飞行器通信协议 | Micro Air Vehicle Link，无人机领域的标准轻量通信协议，GCS、数传、SDK（MAVSDK）都用它跟飞控对话 |
| **UORB** | 内部消息总线 | PX4 内部各模块之间传递数据的发布/订阅机制，类似 ROS 的 Topic。例如 IMU 驱动把数据发布到 `/sensor_combined`，姿态控制器订阅后计算输出。所有模块通过 UORB 解耦，互不直接调用 |
| **Actuator** | 执行器 | 接受飞控指令并产生物理动作的设备，包括电调（驱动电机）、舵机（控制舵面）等 |
| **Sensors** | 传感器（各类） | 飞控的感知输入，具体包括：**Distance**（测距/避障）、**IMU**（惯性测量单元，测加速度和角速率）、**Baro**（气压计，测高度）、**GPS**（全球定位）、**Flow**（光流，低空精准悬停） |
| **Motors** | 电机 | 由电调驱动旋转产生推力，飞控通过调节各电机转速控制姿态和位置 |
| **Payload** | 任务载荷 | 挂载在飞机上执行任务的设备，如相机、喷洒系统、探测仪器等，不参与飞行控制 |
| **PWM / MAVLink** | 输出信号格式 | **PWM**（脉冲宽度调制）是飞控直连电调/舵机的传统模拟信号；**MAVLink** 这里指通过协议控制智能外设（如云台），两种方式都是飞控向执行器发送指令的手段 |
| **Flight Controller (Pixhawk)** | 飞行控制器（Pixhawk） | 整个系统的大脑，运行 PX4，读取所有传感器数据，通过控制算法（PID 等）计算输出，驱动电机和舵机保持飞行稳定 |

---

## 整体数据流

> 遥控器 / GCS → 飞控（Pixhawk + PX4 + NuttX）读传感器 → UORB 总线在内部传数据 → 输出 PWM 驱动电机/执行器 → 遥测数传把状态回传 GCS

![FC and Companion Computer](/images/px4_arch_fc_companion.svg)

## 核心组件说明（飞控 + 机载计算机）

| 组件 / 缩写 | 中文名 | 说明 |
|------------|--------|------|
| **Companion Computer** | 机载计算机 | 安装在飞机上的 Linux 计算机（如 Raspberry Pi、Jetson、NUC），负责运行复杂算法（视觉、路径规划、AI），飞控只做底层稳定控制 |
| **Serial / Ethernet** | 串口 / 以太网 | 飞控与机载计算机的物理连接方式。串口（UART）简单通用；以太网带宽更高，是推荐方式（当飞控支持时） |
| **MAVLink** | 微型飞行器通信协议 | 飞控与机载计算机之间最常用的通信协议，机载计算机通过它发送任务指令、读取飞行状态 |
| **uXRCE-DDS** | 微型 XRCE-DDS 中间件 | 替代旧版 RTPS 的新一代通信方案，让 ROS 2 节点可以直接订阅/发布 PX4 内部的 uORB 消息，延迟更低、集成更深 |
| **microROS** | 微型 ROS | 在资源受限设备（含飞控）上运行的精简版 ROS 2 客户端，可通过串口或网络与机载计算机上的 ROS 2 通信 |
| **MAVSDK** | MAVLink SDK | 封装 MAVLink 协议的多语言库（Python / C++ / Swift 等），让机载计算机程序无需直接解析 MAVLink 即可控制飞机 |
| **ROS 2** | 机器人操作系统 2 | 运行在机载计算机上的主流机器人中间件，用于传感器融合、路径规划、计算机视觉等高层任务，通过 uXRCE-DDS 与 PX4 对接 |
| **MAVLink Router** | MAVLink 路由器 | 运行在机载计算机上的转发程序，将飞控的 MAVLink 流量同时路由给 GCS、云端或多个应用，避免各方争抢串口 |
| **GCS（经机载计算机）** | 地面站（中转） | 机载计算机可作为 MAVLink 中继，将飞控数据转发给远程 GCS，同时提供更大带宽的视频流通道 |

## 整体数据流（含机载计算机）

> 飞控（PX4 + NuttX）← Serial/Ethernet → 机载计算机（Linux）
>
> - 使用 **MAVSDK** → 走 **MAVLink**（命令式：发指令、读遥测）
> - 使用 **ROS 2** → 走 **uXRCE-DDS**（话题式：直接订阅/发布飞控内部 uORB 消息）
> - 高层决策（避障、任务）在机载计算机完成，下发指令给飞控执行
> - MAVLink Router 同时将数据转发给地面 GCS