# 加拿大消防侦察无人机原型机 技术需求规格说明书
# Firefighting Reconnaissance RPAS Prototype — Technical Requirements Specification

---

## 封面 / Cover Page

| 项目 (Item) | 内容 (Content) |
|---|---|
| 项目名称 (Project Name) | 加拿大消防侦察无人机原型机 (Firefighting Reconnaissance RPAS Prototype) |
| 内部代号 (Internal Codename) | AeroTech FireScout-M (示例 / placeholder) |
| 文档编号 (Document No.) | AT-RSD-FS-2026-001 |
| 版本 (Version) | v1.0 (Draft) |
| 发布日期 (Date) | 2026-04-25 |
| 文档分类 (Classification) | Company Confidential — Engineering |
| 适用法域 (Jurisdiction) | Canada (Federal + 10 Provinces + 3 Territories) |
| 主要监管路径 (Primary Regulatory Path) | Transport Canada CARs Part IX, Standard 922 (PVD), ISED RSS-Gen / RSS-247 / RSS-210 |
| 文档语言 (Document Language) | 简体中文 + 英文技术术语 (Simplified Chinese with English technical terms) |

---

## 1. 项目概述 (Executive Summary)

本文档为**加拿大消防侦察无人机原型机**(以下简称"本机"或"FireScout-M")定义完整的工程技术需求规格。本机定位为加拿大主流消防侦察级 RPAS(Remotely Piloted Aircraft System),用于支持 Alberta Wildfire、BC Wildfire Service、Parks Canada、Ontario MNRF、SOPFEU(Société de protection des forêts contre le feu)等省级及联邦消防机构的野火探测、热点测绘(hotspot mapping)、火线巡逻(fire-line patrol)、夜间红外扫描(nighttime IR scanning)和事后冷却评估(post-fire cooling assessment)。

加拿大监管环境在 2025 年 11 月 4 日发生根本性转变:**SOR/2025-70**《Regulations Amending the Canadian Aviation Regulations (RPAS – Beyond Visual Line-of-Sight and Other Operations)》全面生效,首次允许 25–150 kg 中型 RPAS 在视距内(VLOS)无需 SFOC 即可运行,并开放 Lower-Risk BVLOS(Level 1 Complex)在不受控空域、低于 122 m AGL、在人口稀少区或无人区上方的常规飞行 ([Transport Canada](https://tc.canada.ca/en/aviation/drone-safety/2025-summary-changes-canada-drone-regulations))。野火侦察恰好落在该新框架的最佳作业窗口(uncontrolled airspace + sparsely populated boreal forest)。

::: info 关键定位决策
- **MTOW 等级**: 目标 18–24 kg(Small Advanced 上限附近,典型主流值 ~22 kg),并预留 25–35 kg "Medium" 配置(需 Standard 922 PVD 路径),以同时覆盖 Hinton GRID 已认证供应商(如 Volatus Aerospace、Stinson Aerial)所使用的载荷级别 ([Volatus Aerospace](https://volatusaerospace.com/wildfire-drone-services/))
- **核心载荷**: LWIR 热成像(≥640×512)+ EO 光学变焦(≥30×)+ 激光测距(≥1200 m)三合一吊舱,对标 SIYI ZT30 / DJI H30T 等主流配置的功能集,但对政府客户优先采用非中国供应链替代品(Workswell Wiris Pro / FLIR Hadron 640R / Teledyne FLIR Vue TZ20)
- **航程与续航**: BVLOS 作业半径 5–15 km,任务续航 ≥45 min(目标 75 min),与 BC Wildfire Service 合同商 Stinson Aerial 实际作业的 6–8 km 夜间红外扫描需求一致 ([Radio NL](https://www.radionl.com/2025/09/08/b-c-drone-company-wxpanding-to-kamloops-eyes-future-of-firefighting-and-training/))
- **架构**: 折叠式 X8 共轴八旋翼 (coaxial octocopter, redundant) 为基线,可选 VTOL 混合翼版本作为延长续航变体
:::

::: danger 数据主权与采购合规约束
严格遵循 RCMP 2025 年 12 月公开的中国供应链限制立场——"非敏感操作之外不得使用中国制造的 RPAS",联邦/省级政府采购走 Western/Allied supply chain 路线。([CBC News](https://www.cbc.ca/news/politics/rcmp-restricts-chinese-drones-9.6999268))
:::

本机将完成 Transport Canada **Pre-Validated Declaration (PVD)** 路径(适用于 BVLOS 的小/中型 RPAS),并通过 Alberta Wildfire Services 的 **Hinton GRID Testing**(在加拿大其他省份普遍承认的 IR 服务供应商资质评估) ([Aerospace Testing International](https://www.aerospacetestinginternational.com/news/drones-air-taxis/volatus-drones-approved-to-help-fight-forest-fires-in-canada.html))。

---

## 2. 文档范围与用途 (Document Scope and Purpose)

### 2.1 范围 (Scope)
本文档涵盖原型机从产品定义到型号声明(Type Declaration)阶段所需的所有顶层与子系统级技术需求,包括:

1. 飞行器(Air Vehicle)硬件
2. 地面控制站(Ground Control Station, GCS)硬件
3. 通信链路(C2 + Payload Link)
4. 任务载荷(Mission Payload)
5. 机载与地面软件栈
6. 云服务与 AI/ML 服务
7. 合规、安全保证(Safety Assurance)与认证证据要求
8. 测试与验证大纲

::: info 不在本文档范围内
具体施工详图(detail drawings)、零部件 BOM 物料清单的精确单价合同、生产线工艺、市场推广材料。
:::

### 2.2 用途 (Purpose)
- 作为研发团队(机械、电子、固件、感知、云、QA)的统一技术对齐基准;
- 作为对 Transport Canada 提交 PVD 计划(AC 901-001 流程)的技术支撑文件之一;
- 作为对供应商(motor、ESC、电池、链路、吊舱、伞)发出 RFQ/RFP 的需求底稿;
- 作为合规、采购、法务团队进行政府投标(GoA、BCWS、SOPFEU、Parks Canada)资格核验的输入。

### 2.3 受众 (Audience)
首席工程师 (Chief Engineer)、Accountable Executive (per RPOC requirement)、Quality Manager、Compliance & Regulatory Affairs Lead、Cybersecurity Lead、Privacy Officer、Test Pilot/Flight Reviewer、供应链经理、所有研发分组负责人。

---

## 3. 术语与缩写 (Definitions and Acronyms)

| 缩写 | 全称 / 释义 |
|---|---|
| AGL | Above Ground Level — 离地高度 |
| BVLOS | Beyond Visual Line-of-Sight — 超视距运行 |
| C2 | Command and Control link — 指挥与控制链路 |
| CARs | Canadian Aviation Regulations — 加拿大航空法规 |
| CACS | Canadian Active Control System (Natural Resources Canada GNSS network) |
| DAA | Detect and Avoid — 探测与规避 |
| EVLOS | Extended Visual Line-of-Sight — 延伸视距 |
| FRC | Flight Readiness Certificate (Government of Alberta procurement) |
| GoA | Government of Alberta |
| GRID | Hinton (Cache Percotte) GRID Testing — Alberta Wildfire IR 评估场 |
| HIRF | High-Intensity Radiated Fields |
| ICES | Interference-Causing Equipment Standard (ISED) |
| ISED | Innovation, Science and Economic Development Canada |
| LC1 | Level 1 Complex Operations(Lower-risk BVLOS 飞行员证书等级) |
| LWIR | Long-Wave Infrared(8–14 μm 热成像) |
| MAVLink | Micro Air Vehicle Link 协议 |
| MTOW | Maximum Take-Off Weight — 最大起飞重量 |
| NRCan | Natural Resources Canada — 加拿大自然资源部 |
| PIA | Privacy Impact Assessment — 隐私影响评估 |
| PIPA | Personal Information Protection Act(BC、AB 各有) |
| PIPEDA | Personal Information Protection and Electronic Documents Act |
| PVD | Pre-Validated Declaration(Standard 922 第二类路径) |
| RPAS | Remotely Piloted Aircraft System |
| RPOC | RPAS Operator Certificate |
| RSS | Radio Standards Specification(ISED) |
| SAD | Safety Assurance Declaration |
| SDR | Service Difficulty Report(CARs 901.198–199) |
| SFOC | Special Flight Operations Certificate |
| SIL/HIL/SITL | Software/Hardware/Software-In-The-Loop |
| SOPFEU | Société de protection des forêts contre le feu(魁北克) |
| SORA | Specific Operations Risk Assessment(JARUS 方法) |
| UN 38.3 | 联合国《危险品运输试验和标准手册》第 III 部分第 38.3 节(锂电池) |
| VLOS | Visual Line-of-Sight |

---

## 4. 系统级需求 (System-Level Requirements)

::: tip 优先级说明
<Badge type="danger" text="M" /> Must — 强制，不满足则不合规 &nbsp;&nbsp; <Badge type="warning" text="S" /> Should — 应实现，有充分理由可豁免 &nbsp;&nbsp; <Badge type="tip" text="N" /> Nice-to-have — 可选增强

Traceability 列指向具体法规条款或上游需求编号。
:::

### 4.1 任务概述

::: info 任务 A — 火点侦察 (Fire Reconnaissance)
在野火爆发后 **2 小时**内抵达边缘 5–10 km 半径,进行 LWIR 热点搜索 + EO 现场记录 + 激光测距坐标标注。
:::

::: info 任务 B — 火线巡逻 (Fire-line Patrol)
沿 ICS 划定火线进行重复轨迹扫描,生成地理参考热图,典型 **60 min** 任务循环。
:::

::: warning 任务 C — 夜间冷却评估 (Nighttime IR Cooling Survey)
与 BC Wildfire Service 现行合同模式一致,**9 PM–6 AM** 期间对已控制火场 6–8 km 远端进行 BVLOS 红外扫描并向 Incident Command 提交地理参考地图。夜间 BVLOS 作业对链路可靠性与 DAA 要求最高。([Radio NL](https://www.radionl.com/2025/09/08/b-c-drone-company-wxpanding-to-kamloops-eyes-future-of-firefighting-and-training/))
:::

### 4.2 顶层需求表

| ID | 需求描述 | 优先级 | Traceability |
|---|---|---|---|
| SYS-001 | 系统 MTOW 基线版 ≤ 25 kg(Small Advanced),延伸版 ≤ 35 kg(Medium VLOS / LC1 BVLOS) | <Badge type="danger" text="M" /> | CARs 900, Std 922 |
| SYS-002 | 系统应支持 **Lower-Risk BVLOS (LC1)** 运行:不受控空域、< 122 m AGL、距 CFS/WAS 列出机场 ≥ 5 NM、过 unpopulated 或 sparsely populated 区域(< 25 人/km²) | <Badge type="danger" text="M" /> | CARs 901; SOR/2025-70 |
| SYS-003 | 系统应通过 Standard 922 **Pre-Validated Declaration (PVD)** 路径完成机型声明,而非简单 SAD,以确保 Transport Canada 主动审查并降低事后撤销风险 | <Badge type="danger" text="M" /> | AC 901-001 |
| SYS-004 | 任务设计载荷 ≥ 2.5 kg(EO/IR 吊舱 + 备用传感器) | <Badge type="danger" text="M" /> | 内部派生 |
| SYS-005 | 任务续航 ≥ 45 min(满载、20 °C、海平面),目标 75 min;延伸 VTOL 配置 ≥ 120 min | <Badge type="danger" text="M" /> / <Badge type="warning" text="S" /> | 派生自 BCWS 合同典型 |
| SYS-006 | 作业半径(C2 + 视频链 5 dBi 鞭状天线、视距条件) ≥ 10 km;配合定向地面中继 ≥ 20 km | <Badge type="danger" text="M" /> | BCWS 6–8 km 实际需求基线 |
| SYS-007 | 工作温度范围 −20 °C 至 +50 °C(Std 922.06 环境包络);存储 −30 °C 至 +60 °C | <Badge type="danger" text="M" /> | Std 922.06 |
| SYS-008 | 防护等级 ≥ IP43(防尘 / 防细水滴),关键电子舱 IP54 | <Badge type="danger" text="M" /> | 派生 |
| SYS-009 | 满足 ISED RSS-Gen / RSS-247 / RSS-210 / RSS-119 / ICES-003 标识合规;所有发射机均列入 ISED Radio Equipment List (REL) | <Badge type="danger" text="M" /> | ISED |
| SYS-010 | 满足 Standard 922 单点失效(single-point-failure)安全保证:动力冗余 + C2 双链路 + 终端策略(geofence + 自动返航 + 紧急回收伞) | <Badge type="danger" text="M" /> | Std 922.07 |
| SYS-011 | 符合 PIPEDA / 省级 PIPA / Quebec Law 25 数据保护要求,默认本地存储 + 用户驱动上传 | <Badge type="danger" text="M" /> | 隐私法规 |
| SYS-012 | 政府版供应链约束:核心半导体除外,关键 RF / 链路 / 吊舱 / 飞控不得为 PRC 实体清单或与 RCMP 限制方向冲突的供应商 | <Badge type="danger" text="M" /> | PIN 2025-03;RCMP 2025-12 立场 |
| SYS-013 | 文档与 UI 提供 EN/FR 双语,按 Official Languages Act 与 Quebec Bill 96 要求 | <Badge type="danger" text="M" /> | OLA;Bill 96 |
| SYS-014 | 所有飞行数据记录 ≥ 7 年保留(政府客户),加密静态存储 | <Badge type="danger" text="M" /> | 政府审计 |
| SYS-015 | 系统 MTBF(关键飞行控制系统)目标 ≥ 1500 飞行小时;每架飞机每年提交 Annual Report(SDR + 飞行小时 + 设计变更) | <Badge type="danger" text="M" /> | Std 922; CARs 901.198 |
| SYS-016 | 系统支持 NAV CANADA NAV Drone app 集成的 LC1 BVLOS 4 类运行 | <Badge type="warning" text="S" /> | NAV CANADA |
| SYS-017 | 系统在 SFOC 路径(野火 NOTAM 5 NM / 3000 ft AGL)下也可运行,即支持 CARs 601.15 例外申请 | <Badge type="danger" text="M" /> | CARs 601.15 |

---

## 5. 硬件需求 (Hardware Requirements)

### 5.1 机体与气动 (Airframe)

#### 5.1.1 构型分析
| 构型 | 优势 | 劣势 | 决策 |
|---|---|---|---|
| 四旋翼 (Quadcopter) | 简单、轻 | 单电机失效即坠机,不满足 922.07 单点失效 | 否决(基线) |
| 六旋翼 (Hexacopter) | 单电机失效仍可降落 | 中等冗余,机臂较长 | 备选 |
| **共轴八旋翼 (X8 Coaxial Octo)** | 双发冗余 + 紧凑折叠 + 大载荷 | 共轴效率 ~85% | **基线** |
| VTOL Hybrid | 长续航 | 复杂、起降空间 | 延伸版本 |

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-AF-001 | 基线构型为 **X8 共轴八旋翼**,机臂可折叠用于皮卡/Pelican 1620 运输 | <Badge type="danger" text="M" /> | SYS-005, Std 922.07 |
| HW-AF-002 | 机臂、中心板采用 T700/T800 级碳纤维复合材料,关键接头钛合金或 7075-T6 铝 | <Badge type="danger" text="M" /> | 派生 |
| HW-AF-003 | 整机展开尺寸 ≤ 1500 mm × 1500 mm × 600 mm;折叠 ≤ 700 × 500 × 400 mm | <Badge type="warning" text="S" /> | 部署便利 |
| HW-AF-004 | 防护等级 IP43(机身整体)/ IP54(电子仓) | <Badge type="danger" text="M" /> | SYS-008 |
| HW-AF-005 | 工作温度 −20 °C 至 +50 °C;材料热膨胀差异在该范围内不导致结构松动 | <Badge type="danger" text="M" /> | SYS-007, Std 922.06 |
| HW-AF-006 | 提供至少 2 个标准载荷接口(下挂 + 顶部),接口符合内部 V-Mount/SkyPort 风格快拆 | <Badge type="warning" text="S" /> | 模块化 |
| HW-AF-007 | 起落架可承受 1.2 g 硬着陆,具备 -20 °C 雪地稳定支撑面 | <Badge type="danger" text="M" /> | 派生 |

**预估机体成本**:CAD 8,000–15,000(原型件、不含批量)。

### 5.2 动力系统 (Propulsion)

#### 5.2.1 推荐选型(非中国优先)
| 厂商 | 国别 | 型号示例 | 备注 |
|---|---|---|---|
| **KDE Direct** | 美国 | KDE7215XF-135 + KDE-UAS35UVC ESC | 政府友好;批次稳定 |
| **T-Motor** | 中国 | P80 III、U10II + Alpha 60A | 性能领先,但政府版应避免 |
| **Hobbywing X-Class** | 中国 | X9 Plus + XRotor Pro | 同上 |
| **MAD Motor** | 中国 | M10 IPE 等 | 同上 |
| **Plettenberg** | 德国 | NOVA 15 / 25 | 工业级,昂贵 |

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-PR-001 | 政府版整机优先采用 **KDE Direct** (US) 电机 + ESC,价格区间 CAD 350–550/电机、200–350/ESC | <Badge type="danger" text="M（政府版）" /> | PIN 2025-03 |
| HW-PR-002 | 商业版可选 T-Motor / Hobbywing,但需在用户合同中明示供应链国别 | <Badge type="warning" text="S" /> | SYS-012 |
| HW-PR-003 | 单电机额定推力 ≥ 6 kg @ 50% 油门,峰值 ≥ 12 kg | <Badge type="danger" text="M" /> | 派生(MTOW × 2 推重比) |
| HW-PR-004 | ESC 支持 DShot600 或 PWM 高分辨率,含温度遥测、电流遥测、电机方向反向 | <Badge type="danger" text="M" /> | PX4 集成 |
| HW-PR-005 | 螺旋桨为碳纤维折叠桨(28–32 寸),静态平衡 ≤ 0.1 g·cm,动态平衡上机检测 | <Badge type="danger" text="M" /> | 振动→EKF 影响 |
| HW-PR-006 | 任意 1 台电机失效后系统可继续受控飞行至降落点 ≥ 2 min,记录于 FMEA | <Badge type="danger" text="M" /> | Std 922.07 |

### 5.3 电源系统 (Power System)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-PW-001 | 双冗余主电池组(2× 智能电池),并联供电,任一电池故障可保留 ≥ 50% 续航 | <Badge type="danger" text="M" /> | Std 922.07 |
| HW-PW-002 | 单电池能量 ≥ 1.0 kWh,化学体系优先 **Li-ion 21700**(Panasonic NCR21700A、LG M50LT、Samsung 50E)而非 LiPo,以提高低温性能与循环寿命 | <Badge type="danger" text="M" /> | SYS-007 |
| HW-PW-003 | 电池组通过 **UN 38.3** 测试(运输强制) | <Badge type="danger" text="M" /> | UN 38.3 |
| HW-PW-004 | 单电池组 > 1.0 kWh 时,推荐通过 **UL 2271** 认证(降低保险与公共安全采购阻力) | <Badge type="warning" text="S" /> | UL 2271 |
| HW-PW-005 | BMS 通过 SMBus 或自定义 CAN 与飞控通信,上报 SoC、SoH、单芯压差、温度、循环次数 | <Badge type="danger" text="M" /> | 派生 |
| HW-PW-006 | 支持热插拔(hot-swap)以缩短任务间隔时间 ≤ 60 s | <Badge type="warning" text="S" /> | 运营效率 |
| HW-PW-007 | 低温启动序列(-20 °C):BMS 内置预热(自加热膜或 PTC),首次通电后 ≤ 90 s 可起飞 | <Badge type="danger" text="M" /> | SYS-007 |
| HW-PW-008 | 优先采用日韩供应链(Panasonic Japan / LG Energy Solution Korea / Samsung SDI Korea);Tattu 等中国电芯仅限非政府版 | <Badge type="danger" text="M" /> | SYS-012 |

### 5.4 飞控 (Flight Controller)

#### 5.4.1 飞控硬件比较
| 平台 | 优势 | 劣势 | 商业商用化 |
|---|---|---|---|
| **Pixhawk 6X** (Holybro) | 三 IMU 双气压、Rev 8 减振胶、PX4 1.14+ 与 ArduPilot 4.5+ 双系统支持 | 需要适配载机 | ★★★★★ |
| Pixhawk 6C | 较低成本 | 单/双 IMU、性能略低 | ★★★★ |
| Cube Orange+ | H7 处理器、行业熟悉度高 | 闭源风险(部分模块)、新硬件迭代慢 | ★★★★ |
| Holybro Durandal | 高性价比 | 已退市;社区支持下降 | ★★ |

参考:Pixhawk 6X "supports PX4 1.14.3 release or later, as well as the Ardupilot 4.5.0 stable release or later. It ships with PX4 firmware by default" ([Holybro](https://holybro.com/products/pixhawk-6x))。

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-FC-001 | 主飞控为 **Pixhawk 6X** (Holybro Rev 8 工业版减振),三 IMU 双气压计 | <Badge type="danger" text="M" /> | Std 922.07 redundancy |
| HW-FC-002 | 飞控固件采用 **PX4 v1.15+**(BSD-3-Clause),不使用 ArduPilot(GPLv3 不利于专有定制商业化) | <Badge type="danger" text="M" /> | License 分析 |
| HW-FC-003 | 飞控独立 IMU + 备用气压计 + 备用磁力计组成 INS 三路冗余 | <Badge type="danger" text="M" /> | Std 922.07 |
| HW-FC-004 | 飞控支持双 GNSS 输入 + 自动故障切换 | <Badge type="danger" text="M" /> | Std 922.07 |
| HW-FC-005 | MAVLink v2 启用 message signing(消息签名)防止非授权指令注入 | <Badge type="danger" text="M" /> | 网络安全 |

PX4 license note: "PX4 operates under the BSD license, so any changes made to the code does not need to be pushed to the main branch... ArduPilot operates under the GPL license, where source code for any distributed binary must be made available to recipients — meaning proprietary modifications cannot be kept fully closed-source" ([Drone Dojo](https://dojofordrones.com/ardupilot-vs-px4/))。

### 5.5 GNSS / RTK

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-GN-001 | 主 GNSS 为双频 RTK,推荐 **Septentrio mosaic-X5**(比利时,符合 SYS-012)或 Holybro H-RTK F9P(瑞士 u-blox 芯片) | <Badge type="danger" text="M" /> | SYS-012 |
| HW-GN-002 | 备份 GNSS 为独立单元(异型号、异厂家),自动 voting | <Badge type="danger" text="M" /> | Std 922.07 |
| HW-GN-003 | 兼容 **Canadian Active Control System (CACS)** / **CSRS-PPP** 校正源(NRCan 提供) | <Badge type="danger" text="M" /> | 数据主权 |
| HW-GN-004 | 不依赖任何中国 CORS 网络;不调用 BeiDou-only 模式(可同时接收 BDS 但不可仅依赖) | <Badge type="danger" text="M" /> | SYS-012 |
| HW-GN-005 | RTK 浮点收敛 ≤ 60 s,固定解水平精度 ≤ 2 cm + 1 ppm | <Badge type="danger" text="M" /> | 地理参考精度 |

### 5.6 伴随计算机 (Companion Computer)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-CC-001 | 主板为 **NVIDIA Jetson Orin NX 16 GB**(基线;权衡 AI 算力 100 TOPS vs 功耗 10–25 W);Government 高级版可升 AGX Orin 64 GB | <Badge type="danger" text="M" /> | AI-001..010 |
| HW-CC-002 | 启用 Secure Boot + Hardware Root of Trust(NVIDIA Fuse-based) | <Badge type="danger" text="M" /> | 网络安全 |
| HW-CC-003 | NVMe SSD ≥ 512 GB,全盘 LUKS / dm-crypt 加密,密钥由云端 KMS 派发 | <Badge type="danger" text="M" /> | PIN 2025-03 远程数据擦除 |
| HW-CC-004 | 支持 PoE+ 或独立 12 V 5 A 供电,DC/DC 与主电池隔离 | <Badge type="warning" text="S" /> | EMI 隔离 |

### 5.7 通信链路 (Communications)

#### 5.7.1 C2 / 视频 / 备份链路矩阵
| 通道 | 频段 | 推荐设备 | 国别 | 用途 |
|---|---|---|---|---|
| **主 C2** | 902–928 MHz ISM | **Microhard pDDL900** / RFD900x | Canada / 澳大利亚 | 长距 C2 + 关键遥测 |
| **副 C2 / 视频** | 2.4 GHz | **Microhard pMDDL2450** | Canada (Calgary) | MIMO,Ethernet+Serial |
| 高带宽视频 | 2.4 / 5 GHz | **Silvus StreamCaster SC4240** | 美国 | MN-MIMO mesh,军用级 |
| 卫星备份 | Iridium L-band | **Iridium Certus 9770** | 美国 | BVLOS 应急遥测 + ATC 通报 |
| 蜂窝备份 | LTE/5G | Sierra Wireless / **Cradlepoint** | 加/美 | 备份遥测;Bell/Rogers/Telus 三网 |

Microhard pDDL2450 specs: Calgary-based, 30 dBm Tx, sensitivity to -99 dBm @ BPSK_1/2, simultaneous Ethernet + serial ([Microhard](https://www.microhardcorp.com/pDDL.php))。

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-RF-001 | 主 C2 链路采用 **Microhard pDDL900-ENC**(902–928 MHz)或同等 RFD900x;Microhard 政府版优先(Calgary 制造,数据主权友好) | <Badge type="danger" text="M" /> | SYS-012 |
| HW-RF-002 | 视频/副 C2 采用 **Microhard pMDDL2450 MIMO**,以提供 6 dB 以上抗多径裕量 | <Badge type="danger" text="M" /> | 数据链可靠性 |
| HW-RF-003 | 所有 RF 模块在 ISED **Radio Equipment List (REL)** 中可查到 IC ID;原型机投产前完成 RSS-247 / RSS-210 / RSS-Gen 测试 | <Badge type="danger" text="M" /> | ISED |
| HW-RF-004 | C2 链路具备 AES-256 链路加密 + 每 24 小时密钥轮换 | <Badge type="danger" text="M" /> | Std 922.09 |
| HW-RF-005 | 集成 **Iridium Certus 9770** 模组用于 BVLOS 备份遥测 + 自动 ATC 报告(若进入 atypical airspace) | <Badge type="danger" text="M" /> | Std 922; SOR/2025-70 |
| HW-RF-006 | LTE/5G 模组优先选 **Cradlepoint W1850**(双 SIM)或 Sierra Wireless EM7565,经 Bell/Rogers/Telus 三大运营商认证 | <Badge type="warning" text="S" /> | 蜂窝冗余 |
| HW-RF-007 | 不采用 SIYI HM30 / Herelink 作为政府版主链路(中国供应链)。商业版可选 SIYI HM30 但应明示 | <Badge type="danger" text="M" /> | SYS-012 |
| HW-RF-008 | C2 链路在 95% 任务时长内丢包率 ≤ 1%,在最坏 5 分钟窗口丢包率 ≤ 5%,符合 Std 922.09 | <Badge type="danger" text="M" /> | Std 922.09 |

### 5.8 主任务载荷 (Mission Payload — Gimbal)

#### 5.8.1 候选吊舱比较
| 吊舱 | 国别 | LWIR 分辨率 | EO 变焦 | 激光测距 | MTOW 影响 | 政府采购 | 价格 (CAD) |
|---|---|---|---|---|---|---|---|
| SIYI ZT30 | China | 640×512 | 30× | 1200 m | 920 g | ✗ | 7–10k |
| DJI H30T | China | 640×512 | 34× | 3000 m | 920 g | ✗ | 14–18k |
| **Workswell Wiris Pro Sc** | Czech Republic | 640×512 | 30× | 选配 | ~400 g (无万向架) | ✓ | 25–35k |
| **Teledyne FLIR Hadron 640R** | USA | 640×512 (Boson 640) | 64× (32× hybrid) EO | 选配外置 | ~115 g 模组 | ✓ | 4–6k(模组),整吊舱 18–25k |
| **Teledyne FLIR Vue TZ20** | USA | 640×512 双 LWIR | — | 无 | ~550 g | ✓ | 8–11k |

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-PL-001 | LWIR 热成像分辨率 ≥ 640×512,NETD ≤ 50 mK @ 30 °C,温度测量范围 -40 °C 至 +600 °C(高温区) | <Badge type="danger" text="M" /> | Hinton GRID 灵敏度 |
| HW-PL-002 | EO 光学最大变焦 ≥ 30× 光学(或 30× 等效混合),分辨率 ≥ 4K | <Badge type="danger" text="M" /> | 视觉确认 |
| HW-PL-003 | 集成激光测距,最大测距 ≥ 1200 m,精度 ±1 m | <Badge type="danger" text="M" /> | 火点定位 |
| HW-PL-004 | **政府版基线吊舱 = Workswell Wiris Pro Sc**(捷克,FLIR Boson 内核);**商业版** = SIYI ZT30 (低成本) 或 DJI H30T(高性能) | <Badge type="danger" text="M" /> | SYS-012 |
| HW-PL-005 | 吊舱具备三轴稳定,稳定精度 ≤ ±0.005°,轴角行程:Pan ±170°、Tilt -120° / +90° | <Badge type="danger" text="M" /> | 派生 |
| HW-PL-006 | 吊舱视频通过 H.265 编码至 ≤ 8 Mbps 的可调码率,适配链路条件 | <Badge type="danger" text="M" /> | 链路裕量 |
| HW-PL-007 | 吊舱 GMV/IMU 输出与机载 Jetson 时间同步 ≤ 5 ms(PTP/IEEE 1588) | <Badge type="danger" text="M" /> | Geo-referencing |

### 5.9 探测与规避 / 障碍物避障 (DAA / OA)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-DAA-001 | 集成 **ADS-B In** 接收器(GA aircraft 协同感知),推荐 uAvionix pingRX Pro(USA);BVLOS 任务下必须开启 | <Badge type="danger" text="M" /> | Std 922.10; CARs 901.97 |
| HW-DAA-002 | 障碍物避障:基线采用 **Ouster OS0-128**(US,128 线 LiDAR)或同级 Hesai/Livox 替代;政府版强制 Ouster | <Badge type="danger" text="M" /> | SYS-012, smoke-resilient |
| HW-DAA-003 | 烟雾环境下视觉避障辅助:**Intel RealSense D457**(车规)立体视觉模组,与 LiDAR 融合 | <Badge type="danger" text="M" /> | 烟雾穿透 |
| HW-DAA-004 | 实现 Vision-based DAA 的可声明合规路径 = Standard 923(替代 922.10) | <Badge type="warning" text="S" /> | Std 923 |
| HW-DAA-005 | 雷达可选(若需穿浓烟): Echodyne EchoFlight(US) | <Badge type="tip" text="N" /> | 烟雾极端条件 |

### 5.10 紧急回收伞 (Recovery Parachute)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-RP-001 | 配备 **ASTM F3322** 兼容回收伞系统;政府版基线 = **ParaZero SafeAir Pro / Mars M-300**;选 25 kg+ 适用版本 | <Badge type="danger" text="M" /> | Std 922.07 single-point-failure mitigation; ASTM F3322 |
| HW-RP-002 | 回收伞需通过第三方机构进行 ≥ 45 次空投失效场景验证(ASTM 要求) | <Badge type="danger" text="M" /> | ASTM F3322-18 ([UST](https://www.unmannedsystemstechnology.com/2019/07/safeair-uas-parachutes-certified-in-canada-for-flight-over-people/)) |
| HW-RP-003 | 部署条件:GPS 故障 + 双 IMU 不一致 + 电池组双失效 + 飞行员手动触发(物理急停) | <Badge type="danger" text="M" /> | FMEA |
| HW-RP-004 | 部署后下降速度 ≤ 5 m/s,触发音频警报 ≥ 90 dB @ 1 m | <Badge type="danger" text="M" /> | ASTM F3322 |

### 5.11 灯光与可见性 (Lighting)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-LT-001 | 安装高强度白色防撞频闪灯(可见 ≥ 5 km @ 夜间),与 CARs 901.40 一致 | <Badge type="danger" text="M" /> | CARs 901.40 |
| HW-LT-002 | 红/绿/白舷灯(便于视觉观察员判断航向) | <Badge type="danger" text="M" /> | CARs |

### 5.12 环境传感器

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-EN-001 | **Trisonica Mini ultrasonic anemometer**(LI-COR US)集成于上方支架,提供 3D 风速、温度、湿度,采样 ≥ 10 Hz | <Badge type="warning" text="S" /> | 火行为评估 |
| HW-EN-002 | 内部气压、外部气压、空速管(若 VTOL 版本) | <Badge type="danger" text="M" /> | 派生 |

### 5.13 地面控制站 (Ground Control Station)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-GS-001 | 推荐三段式硬件:**Getac F110-G7**(加拿大有渠道,加固平板)+ **Microhard pDDL900 ground modem** + 自研 RC 手柄 | <Badge type="danger" text="M" /> | 数据主权 |
| HW-GS-002 | 不采用 Herelink(中国)作为政府版主控制器;商业版可选 | <Badge type="danger" text="M" /> | SYS-012 |
| HW-GS-003 | 双频对数周期 / 螺旋天线安装于 6 m 折叠桅杆,适合 fire truck / pickup 部署 | <Badge type="danger" text="M" /> | 链路距离 |
| HW-GS-004 | 备用电源(车载 12 V + 内部 LiFePO4 ≥ 4 hr 缓冲) | <Badge type="danger" text="M" /> | 现场作业 |

### 5.14 适航环境测试需求

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| HW-EV-001 | 振动测试:DO-160G Cat. M / Cat. R 等效 frequency sweep + 随机谱 | <Badge type="danger" text="M" /> | Std 922 |
| HW-EV-002 | 温度循环:-30 °C 至 +55 °C × 10 cycles,功能确认 | <Badge type="danger" text="M" /> | Std 922.06 |
| HW-EV-003 | EMI/EMC:符合 RTCA DO-160G Section 20–21 + ICES-003 | <Badge type="danger" text="M" /> | ISED |
| HW-EV-004 | HIRF 暴露(高强度辐射场):Section 20 Cat. R 限度内不丧失受控飞行 | <Badge type="danger" text="M" /> | Std 922.06; AC 922-001 |

---

## 6. 软件需求 (Software Requirements)

总体架构遵循用户已定义的"五库"结构:

| 仓库 (Repo) | 责任 |
|---|---|
| **aerotech-autopilot** | PX4 v1.15+ 定制 / 私有分叉 |
| **aerotech-perception** | ROS 2 Humble + AI 感知 / 避障 / 火点检测 |
| **aerotech-ground-station** | QGroundControl 双语自定义分叉 (Qt/QML) |
| **aerotech-cloud** | Node.js + React 19 + Express + PostgreSQL + Redis(AWS Canada Central) |
| **aerotech-infra** | IaC: Terraform + Ansible + GitHub Actions |

### 6.1 飞行控制固件层 (Autopilot Firmware)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-FC-001 | 基线 PX4 v1.15+ 私有分叉,**不外发 GPL 代码污染**(BSD-3 license 允许闭源派生) | <Badge type="danger" text="M" /> | License |
| SW-FC-002 | 实现 Standard 922.08 兼容的多边形 / 椭圆 geofence,含 inclusion / exclusion / NFZ(NOTAM 5 NM 自动加载) | <Badge type="danger" text="M" /> | Std 922.08; CARs 601.15 |
| SW-FC-003 | C2 双链路自动切换(RFLink_Primary / RFLink_Secondary / Iridium / LTE),切换时延 ≤ 2 s | <Badge type="danger" text="M" /> | Std 922.09 |
| SW-FC-004 | 链路完全失联:30 s 后启动 RTL(Return-to-Launch),60 s 仍失联触发预设 contingency point;3 min 仍失联触发紧急回收伞 | <Badge type="danger" text="M" /> | FMEA; AC 922-001 |
| SW-FC-005 | 低温启动序列:-20 °C 时启动 BMS 预热 → IMU 预热 → 校准检查 → 起飞许可,TPS 全过程显示 GCS | <Badge type="danger" text="M" /> | SYS-007 |
| SW-FC-006 | MAVLink v2 自定义消息集 `FIRE_*`(火点坐标、温度区间、热点置信度)上报至 GCS 和云 | <Badge type="danger" text="M" /> | 派生 |
| SW-FC-007 | 飞参日志同时写入 ULog(本地)+ 加密 JSON(云上传),文件含 SHA-256 校验 | <Badge type="danger" text="M" /> | 审计 |
| SW-FC-008 | 启用 PX4 Pre-Flight Check + Sensor Voting + 强制要求两个 IMU + 两个磁罗盘一致才允许解锁 | <Badge type="danger" text="M" /> | Std 922.07 |
| SW-FC-009 | 实现 NAV CANADA 协议(若发布)或经由 ADSP 第三方对接(为未来 Part 108 等价方案预留) | <Badge type="warning" text="S" /> | 未来扩展 |

### 6.2 伴随计算机软件 (Companion Computer)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-CC-001 | OS 为 **NVIDIA JetPack 6.x / Ubuntu 22.04 LTS**;启用 Secure Boot + signed kernel modules | <Badge type="danger" text="M" /> | 网络安全 |
| SW-CC-002 | 中间件为 **ROS 2 Humble**(LTS 至 2027),DDS = Cyclone DDS;启用 SROS2 + DDS-Security TLS | <Badge type="danger" text="M" /> | 现代机器人栈 |
| SW-CC-003 | 关键 ROS 2 节点列表:`fire_detector`、`smoke_detector`、`thermal_segmenter`、`lidar_processor`、`obstacle_avoider`、`mavlink_bridge`(MAVROS2)、`gimbal_controller`、`georeference_engine`、`telemetry_uplink`、`health_monitor` | <Badge type="danger" text="M" /> | AI-* |
| SW-CC-004 | 所有节点容器化(Docker Compose),版本镜像签名(cosign) | <Badge type="danger" text="M" /> | DevOps |
| SW-CC-005 | TLS 1.3 用于全部上行连接;静态磁盘 LUKS + 云端 KMS 解锁 | <Badge type="danger" text="M" /> | PIN 2025-03 |
| SW-CC-006 | 远程吊销键(Remote Wipe):云端撤销密钥导致设备重启后 SSD 不可解密 | <Badge type="danger" text="M" /> | PIN 2025-03 |

### 6.3 计算机视觉与 AI

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-AI-001 | 火焰/烟雾检测基线模型 = **YOLOv8m / YOLOv11m**;TensorRT INT8 量化部署 | <Badge type="danger" text="M" /> | AI-* |
| SW-AI-002 | 训练数据集组合:**D-Fire**(21 k 图像)+ **FLAME** (NAU,~48 k frames pile burn) + **FLAME 2**(双谱 RGB+IR)+ **FASDD** + 加拿大本地采集集 ≥ 50 飞行小时(jack pine、black spruce、lodgepole pine、雪背景、各时段) | <Badge type="danger" text="M" /> | Hinton GRID |
| SW-AI-003 | 性能目标:fire mAP@0.5 ≥ 0.85;smoke mAP@0.5 ≥ 0.75;烟云区分(smoke-vs-cloud) F1 ≥ 0.80 | <Badge type="danger" text="M" /> | 行业基线(参考 [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10304711/) FLAME segmentation precision 92% / recall 84%) |
| SW-AI-004 | 推理延迟 ≤ 15 ms/frame @ 1080p;吞吐 ≥ 30 FPS 持续 | <Badge type="danger" text="M" /> | 实时性 |
| SW-AI-005 | 热成像分割(thermal segmentation)采用 U-Net / DeepLabV3+,温度区间分类:≤60 °C(已冷却)、60–200 °C(余热)、200–500 °C(活跃)、>500 °C(高强度火头) | <Badge type="danger" text="M" /> | 火行为 |
| SW-AI-006 | Geo-referencing:针孔相机投影模型 + DEM 射线投射,基础高程数据 = **NRCan CanElevation Series 2 m DEM**;水平绝对误差 ≤ 5 m @ 100 m AGL | <Badge type="danger" text="M" /> | NRCan |
| SW-AI-007 | 多光谱融合(可选):RGB + IR 像素级融合提高低对比烟雾下检测率(FLAME 2 已证实) | <Badge type="warning" text="S" /> | FLAME 2 ([NAU](https://experts.nau.edu/en/datasets/flame-2-fire-detection-and-modeling-aerial-multi-spectral-image-d/)) |

### 6.4 地面站软件 (GCS)

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-GS-001 | 基础 fork 自 **QGroundControl** v4.4+ (Apache 2.0),Qt 6 / QML | <Badge type="danger" text="M" /> | License |
| SW-GS-002 | 强制 EN/FR 双语 UI 切换;魁省版默认 FR | <Badge type="danger" text="M" /> | OLA, Bill 96 |
| SW-GS-003 | 离线地图 / DEM 缓存:Mapbox / MapLibre + NRCan WMS;每日 ≤ 5 GB 区域缓存 | <Badge type="danger" text="M" /> | 偏远作业 |
| SW-GS-004 | 火灾任务模板:`grid_search`(网格搜索)、`fireline_patrol`(火线沿线巡逻)、`hotspot_hover_scan`(热点悬停扫描)、`perimeter_orbit` | <Badge type="danger" text="M" /> | 任务 A/B/C |
| SW-GS-005 | 集成 **Hinton GRID 评分模拟器**(对照已知 IR target 灰板) | <Badge type="warning" text="S" /> | GRID 通过率 |
| SW-GS-006 | 实时火点 KML / GeoJSON 导出至 ICS / **GeoServer**,供 Incident Command System 使用 | <Badge type="danger" text="M" /> | BCWS 实操 |

### 6.5 云端后台 (Cloud Admin)

技术栈:**React 19 + TypeScript + Node.js + Express + PostgreSQL 16 + Redis 7**(用户既定栈);区域:**AWS Canada Central (ca-central-1) Montréal**。

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-CL-001 | 三层 RBAC:Super Admin / Department Manager / Staff(operator) | <Badge type="danger" text="M" /> | 访问控制 |
| SW-CL-002 | OAuth 2.0 + Client Certificate(双因素+设备认证);政府版集成 GCKey / SAML | <Badge type="danger" text="M" /> | 安全 |
| SW-CL-003 | 审计日志 7 年保留(政府客户),WORM 存储(S3 Object Lock) | <Badge type="danger" text="M" /> | 联邦审计 |
| SW-CL-004 | Region Locking:所有用户数据(遥测/视频/影像/模型)必须存于 ca-central-1,KMS Keys 也限于 Canada Central | <Badge type="danger" text="M" /> | PIPEDA, PIN 2025-03 |
| SW-CL-005 | API Gateway = AWS API Gateway,Lambda 仅 ca-central-1 | <Badge type="danger" text="M" /> | 数据主权 |

### 6.6 实时遥测与视频管线

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-TM-001 | 实时遥测 = **MQTT 5.0** over TLS 1.3;政府版自托管 **Eclipse Mosquitto** broker(EC2 ca-central-1),不使用 AWS IoT Core(数据主权偏好可调) | <Badge type="danger" text="M" /> | 数据主权 |
| SW-TM-002 | 时序库 = **InfluxDB OSS 2.x** 自托管(EBS gp3 + 跨 AZ 快照),不用 InfluxDB Cloud | <Badge type="danger" text="M" /> | 数据驻留 |
| SW-TM-003 | 可视化 = **Grafana OSS 11** | <Badge type="danger" text="M" /> | — |
| SW-TM-004 | 视频:**WebRTC**(低延迟实时,< 250 ms)+ **HLS**(可重放);S3 ca-central-1 + SSE-KMS 加密 + 90 天热存 / 7 年冷存生命周期 | <Badge type="danger" text="M" /> | 派生 |

### 6.7 边-云协同 AI

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-AC-001 | 边端推理 = 火/烟/障碍物检测(< 15 ms);云端推理 = 火势扩散预测(LSTM / Temporal Fusion Transformer 7 天序列输入)、决策辅助 LLM 简报 | <Badge type="danger" text="M" /> | 系统设计 |
| SW-AC-002 | LLM 优先选择 Canada-hosted endpoint:Cohere(Toronto)Command R+ 或 AWS Bedrock(ca-central-1 提供的 Anthropic Claude 等)+ 显式 region check | <Badge type="danger" text="M" /> | 数据主权 |
| SW-AC-003 | MLOps 平台 = **MLflow OSS 自托管** + AWS SageMaker Studio (ca-central-1) 选用 | <Badge type="warning" text="S" /> | 工程效率 |
| SW-AC-004 | 标注平台 = **CVAT 自托管**;承包商必须签 PIPEDA 兼容数据处理协议(DPA) | <Badge type="danger" text="M" /> | 隐私 |

### 6.8 数据加密、密钥与擦除

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-SC-001 | KMS = AWS KMS + CloudHSM(ca-central-1),CMK rotation 每年 | <Badge type="danger" text="M" /> | 加密 |
| SW-SC-002 | 远程数据擦除:Jetson SSD 由云端 envelope key 解锁,key 撤销 → 设备重启即数据不可恢复 | <Badge type="danger" text="M" /> | PIN 2025-03 |
| SW-SC-003 | TLS 1.3 强制;TLS 1.2 仅向后兼容旧地面站,生产 v1.0 后弃用 | <Badge type="danger" text="M" /> | 网络安全 |

### 6.9 软件物料清单 (SBOM) 与漏洞管理

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-SB-001 | 每次发布生成 **CycloneDX 1.6** 格式 SBOM;工具链 = **Syft + Grype** | <Badge type="danger" text="M" /> | 政府采购 |
| SW-SB-002 | CVE 高危(CVSS ≥ 7.0)在 14 天内修补 OTA | <Badge type="danger" text="M" /> | 网络安全 |
| SW-SB-003 | OTA 升级包签名 = sigstore/cosign + 双人审批 | <Badge type="danger" text="M" /> | 供应链安全 |

### 6.10 测试与 CI/CD

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| SW-CI-001 | CI/CD = **GitHub Actions** + 自托管 runner(ca-central-1)用于敏感构建;固件烧录测试在 HIL rig 自动化 | <Badge type="danger" text="M" /> | 工程 |
| SW-CI-002 | 单元测试覆盖率 ≥ 80%(企业版);感知 / 飞控关键模块 ≥ 90% | <Badge type="danger" text="M" /> | 质量 |
| SW-CI-003 | HIL = **PX4 SITL + Gazebo Garden**;每日回归 ≥ 50 任务场景 | <Badge type="danger" text="M" /> | Std 922.07 evidence |

---

## 7. 云服务与 AI 服务需求 (Cloud and AI Services)

### 7.1 三档版本设计

| 版本 | 场景 | 部署 |
|---|---|---|
| **Government Air-gapped** | 联邦/省政府敏感任务 | GC Cloud(SSC)或客户机房 on-prem,完全断网,本地 ICS/MQTT broker |
| **Commercial AWS** | BC Wildfire 等省级合同与商业用户 | AWS ca-central-1,VPC 隔离,客户专属 KMS Key |
| **Demo/Test** | 销售演示、研发 | AWS ca-central-1 共享 sandbox |

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| CLOUD-001 | 所有用户数据生命周期内 100% 驻留加拿大;不允许跨境冗余 | <Badge type="danger" text="M" /> | PIPEDA;PIN 2025-03 |
| CLOUD-002 | 政府版需通过 **PBMM (Protected B Medium Integrity Medium Availability)** 等级评估;采用 GC Cloud Brokering Service 路径 | <Badge type="danger" text="M" /> | TBS GC Cloud Operationalization Framework |
| CLOUD-003 | KMS:Canada Central CloudHSM,客户管理 CMK 模式;Stage 4A 审计追踪 | <Badge type="danger" text="M" /> | TBS guidance |
| CLOUD-004 | OTA 部署管线:S3 + CloudFront(ca-central-1 边缘节点)+ 双签证书 | <Badge type="danger" text="M" /> | 安全 |
| CLOUD-005 | 隐私影响评估(PIA)交付包:威胁建模 + 数据流图 + 同意流程 + DSR 处理 SOP | <Badge type="danger" text="M" /> | PIPEDA Schedule 1 |
| CLOUD-006 | LLM/生成式 AI 输入与输出日志保留 90 天 + 客户可关闭 | <Badge type="warning" text="S" /> | Bill C-27 趋势 |

### 7.2 实时管线参考架构(简图)

```
[Drone Jetson] ── MQTT/TLS ──> [Mosquitto on EC2 ca-central-1] ──> [InfluxDB OSS]
       │                                  │                                │
       └─ WebRTC ─> [TURN/STUN ec2] ──> [GCS Web (React/Node)]              │
                                          │                                │
                                          └─> [Grafana / fire incident UI]<┘
       └─ HLS ─> [S3 + CloudFront ca-central-1] ─> 后台分析 ─> SageMaker
```

---

## 8. AI 模型与数据集 (AI Models & Datasets)

### 8.1 数据集策略

| 来源 | 规模 | 类型 | 备注 |
|---|---|---|---|
| **D-Fire** (Brazil) | ~21 k images | RGB,fire+smoke labels | 基础多样性 |
| **FLAME** (NAU 2020) | ~48 k frames | RGB + IR pile burn | NAU 北亚利桑那针叶林,与加拿大 boreal 相似 ([IEEE DataPort](https://ieee-dataport.org/open-access/flame-dataset-aerial-imagery-pile-burn-detection-using-drones-uavs)) |
| **FLAME 2** (NAU 2022) | 双谱视频对 | side-by-side RGB+IR | 多模态融合训练([NAU](https://experts.nau.edu/en/datasets/flame-2-fire-detection-and-modeling-aerial-multi-spectral-image-d/)) |
| **FASDD** | ~100 k images | fire+smoke detection | 公开权重 baseline |
| **AeroTech-Boreal-CA**(自采) | ≥ 50 飞行小时 | jack pine / black spruce / lodgepole pine / 雪 / 黄昏 / 烟 | 内部采集 + 标注 |

| ID | 需求 | 优先级 | Traceability |
|---|---|---|---|
| AI-001 | 加拿大本地数据 ≥ 50 小时(原型阶段);量产前 ≥ 200 小时 | <Badge type="danger" text="M" /> | Hinton GRID |
| AI-002 | 标注协议:双标注员独立标注 + Cohen's κ ≥ 0.85 | <Badge type="danger" text="M" /> | 质量 |
| AI-003 | 标签 schema 双语(EN/FR),可输出 COCO / YOLO / Pascal VOC | <Badge type="danger" text="M" /> | OLA |
| AI-004 | 模型架构对比:YOLOv8m / YOLOv11m / RT-DETR-L / Mask R-CNN;选择推断 + mAP 帕累托最优 | <Badge type="danger" text="M" /> | 系统 |
| AI-005 | TensorRT INT8 量化(校准集 ≥ 2 k 图);Jetson Orin NX 上吞吐 ≥ 30 FPS | <Badge type="danger" text="M" /> | SW-AI-004 |
| AI-006 | 模型版本管理 = MLflow Model Registry + 不可变模型 hash 写入飞控日志 | <Badge type="danger" text="M" /> | 可追溯 |
| AI-007 | Hinton GRID 内部演练:在 Cache Percotte test grid(Hinton, AB)进行至少 1 次 IR target 检测演练,目标灵敏度通过既知评级 | <Badge type="danger" text="M" /> | Alberta Wildfire ([Mugglehead](https://mugglehead.com/volatus-aerospace-cleared-to-help-fight-wildfires-in-alberta/)) |
| AI-008 | 模型偏差监控:在 5 个加拿大林型上分别评估 mAP,任一林型 < 全集均值 -10 % 则触发再训练 | <Badge type="warning" text="S" /> | 鲁棒性 |

::: warning Hinton GRID 评分说明
测试的具体评分公式不在公开资料中，Alberta Wildfire 仅公开 **target sensitivity、accuracy、data delivery** 三大维度 ([Aerospace Testing International](https://www.aerospacetestinginternational.com/news/drones-air-taxis/volatus-drones-approved-to-help-fight-forest-fires-in-canada.html))。建议在 PVD 流程中与 GoA 直接申请 redacted scoring rubric。
:::

---

## 9. 合规与认证需求 (Compliance & Certification Requirements)

### 9.1 顶层合规路径

::: warning 三阶段合规路径
**Phase 1（原型）**: SFOC-RPAS for 野火 NOTAM 区作业 + Advanced Pilot Cert + Letter of Acceptance under AC 901-001 ([Transport Canada](https://tc.canada.ca/en/aviation/drone-safety/submitting-drone-safety-assurance-declaration/apply-pre-validated-declaration))

**Phase 2（量产）**: PVD for BVLOS over sparsely populated boreal + RPOC + Level 1 Complex Pilot Certificate ([Transport Canada](https://tc.canada.ca/en/aviation/drone-safety/learn-rules-you-fly-your-drone/drone-operation-categories-pilot-certificates/level-1-complex-operations))

**Phase 3（政府客户）**: Hinton GRID Pass + GoA FRC + provincial procurement onboarding
:::

### 9.2 合规需求矩阵

| ID | 需求 | 证据 | Traceability |
|---|---|---|---|
| COMP-001 | 完整 FMEA(覆盖电源、链路、控制、感知、回收伞、地面站、云后端) | FMEA Excel + 评审纪要 | Std 922.07 |
| COMP-002 | C2 链路可靠性评估(D-stop loss,latency)报告 | 现场实测 + 模拟 | Std 922.09 |
| COMP-003 | 电子地理围栏(Geofence)设计文档与功能验证测试 | 测试报告 | Std 922.08 |
| COMP-004 | 环境测试:RTCA DO-160G 等效振动 / 温度 / EMI / HIRF | 第三方实验室报告(优选 加拿大 NRC-CNRC 或 MET Labs CA) | Std 922.06 |
| COMP-005 | 电池 UN 38.3 测试报告 | 第三方 | UN 38.3 |
| COMP-006 | 电池 UL 2271(若 > 1 kWh) | 第三方 | UL 2271 |
| COMP-007 | RF 模块 IC ID 注册 + REL 列示 | ISED 网站可查 | RSS-* |
| COMP-008 | 网络安全独立审计(优先加拿大本土公司 e.g., **Bulletproof, Fortra, KPMG Canada**;不得为中国关联) | Pen-test report | TBS Cyber |
| COMP-009 | 隐私影响评估 (PIA) 交付物 | 文档包 | PIPEDA |
| COMP-010 | 双语标签:产品标贴、用户手册、维护手册、警告语 EN+FR | 实物样品 | OLA |
| COMP-011 | Service Difficulty Reporting (SDR) 系统建立 | 表单 + 分析流程 | CARs 901.198–199 |
| COMP-012 | 年度报告(估算飞行小时、安全事件、设计变更)格式与流程 | 模板 | Std 922 ([AVSS](https://avss.co/2025/03/o-transport-canada-new-canadian-drone-rules-for-bvlos-150kg-drones-microdrones-and-more-with-full-implementation-by-tuesday-november-4th-2025/)) |

---

## 10. 测试与验证计划摘要 (Test & Verification Plan)

### 10.1 V&V 阶段

| 阶段 | 描述 | 关键里程碑 |
|---|---|---|
| **L0 — 桌面仿真** | PX4 SITL + Gazebo;Jetson 软件 docker 单元 | 月度回归绿灯 |
| **L1 — HIL** | Pixhawk 6X + 实际 IMU/RTK,模拟环境;Jetson 接 SITL | T+3 月 |
| **L2 — 系泊地面测试** | 整机 tethered,电机 / 电池 / 链路 60 min 满油门稳定性 | T+5 月 |
| **L3 — 受控空域试飞** | 空旷农场 SFOC,VLOS,逐项功能验证 | T+7 月 |
| **L4 — BVLOS 试飞** | LC1 流程,200 hr boreal 数据收集 + 模型微调 | T+10 月 |
| **L5 — Hinton GRID 评估** | Cache Percotte 实地评估 | T+12 月 |
| **L6 — 适航环境测试** | DO-160G subset + UN38.3 + ASTM F3322 | T+14 月 |
| **L7 — TC PVD 提交** | AC 901-001 流程 | T+15 月 |

### 10.2 关键测试用例分类
1. **F&E**: failure & emergency — 7 类(C2 失联、GPS 失联、单电机失效、双电机失效、电池故障、IMU vote disagreement、伞触发误差)
2. **EMC/RF coexistence**: WiFi 2.4 / 5 G + LTE band 7/13 + Iridium L 同时工作
3. **Thermal soak**: -25 °C cold soak ≥ 4 hr,然后立即起飞
4. **Cybersecurity red-team**: 链路注入 / GPS spoofing / OTA 篡改

---

## 11. 风险登记表 (Risk Register)

::: danger 高影响风险（影响 = H）需优先处理
RSK-01 · RSK-02 · RSK-04 · RSK-07 · RSK-09 — 任一触发均可导致项目延期 6 个月以上或政府合同资质丧失。
:::

| ID | 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|---|
| RSK-01 | TC 在审 PVD 时撤销既有 SAD(2024 报告先例:110 declarations 受影响) | <Badge type="warning" text="中" /> | <Badge type="danger" text="高" /> | 早期预对接 + 在 PVD 路径而非 SAD;聘用前 TC 审查员 |
| RSK-02 | 加拿大政府在 RCMP 立场扩展至 wildfire 服务后限制中国零件 | <Badge type="warning" text="中" /> | <Badge type="danger" text="高" /> | 政府版采用全西方供应链;BOM 双轨设计 |
| RSK-03 | 跨省 boreal 数据采集季节窗口(5–9 月)不足 | <Badge type="warning" text="中" /> | <Badge type="warning" text="中" /> | 提前签订与 BCWS / SOPFEU / GoA 的数据共享 MoU |
| RSK-04 | Hinton GRID 评估 IR 灵敏度未通过 | <Badge type="tip" text="低" /> | <Badge type="danger" text="高" /> | 选择 Workswell + Boson 高 NETD 配置;预演练 |
| RSK-05 | -20 °C 启动失败(电池预热不充分) | <Badge type="warning" text="中" /> | <Badge type="warning" text="中" /> | 双层 PTC + 飞控阻塞解锁条件 |
| RSK-06 | Iridium Certus 9770 资费高/速率低导致备份遥测不可用 | <Badge type="tip" text="低" /> | <Badge type="warning" text="中" /> | 引入 LTE-Advanced + Starlink Mini(Direct-to-Cell 路线) |
| RSK-07 | YOLOv8 在烟雾中 false negative > 阈值 | <Badge type="warning" text="中" /> | <Badge type="danger" text="高" /> | 多光谱融合(RGB+LWIR);U-Net 二级确认 |
| RSK-08 | Quebec Bill 96 法语合规细节(UI 默认 / 销售文件)解读不一致 | <Badge type="warning" text="中" /> | <Badge type="warning" text="中" /> | 聘魁省律师早期审阅 UI 字符串 |
| RSK-09 | 锂电池 UN 38.3 不通过 | <Badge type="tip" text="低" /> | <Badge type="danger" text="高" /> | 提前选用已有 UN 38.3 报告的电芯供应商(Panasonic/LG/Samsung) |
| RSK-10 | LLM 输出泄露火场敏感坐标 | <Badge type="warning" text="中" /> | <Badge type="warning" text="中" /> | 严格 region locking + 数据脱敏 + 审计 |
| RSK-11 | 政府客户对 ParaZero(以色列)地缘敏感 | <Badge type="tip" text="低" /> | <Badge type="warning" text="中" /> | 备用 Avss(加拿大)伞;但 Avss 的 25 kg 级方案有限 |
| RSK-12 | Bill C-27 通过后需追溯调整 PIA / 数据流 | <Badge type="warning" text="中" /> | <Badge type="warning" text="中" /> | 架构上模块化同意管理 |

---

## 12. 附录 (Appendices)

### 12.1 BOM 摘要(原型机基线 / 政府版)

::: tip 整机 BOM 估算（原型 1 台）
**~ CAD 95,000–120,000**（不含 NRE / 工程开发费）
:::

::: details 点击展开完整 BOM 明细

| 类别 | 部件 | 推荐型号 (Government) | 单价 (CAD) | 备注 |
|---|---|---|---|---|
| 飞控 | Pixhawk 6X | Holybro Pixhawk 6X Rev 8 | 600 | — |
| 伴飞 PC | Jetson Orin NX 16G | NVIDIA + Auvidea / ConnectTech 加拿大经销 | 1,500 | ConnectTech (Guelph, ON) |
| GNSS RTK | Septentrio mosaic-X5 | Septentrio | 1,800 ×2 | — |
| 电机 | KDE Direct | KDE7215XF-135 | 450 ×8 | US |
| ESC | KDE Direct | KDE-UAS35UVC | 300 ×8 | US |
| 螺旋桨 | T-Motor / KDE | KDE-CF305-DP | 220 /对 ×4 | — |
| 电池 | Li-ion 21700 pack | LG M50LT 12S6P custom (~1.1 kWh) | 1,200 ×2 | LG Korea |
| 主 C2 | pDDL900-ENC | Microhard | 1,400 ×2 | Calgary |
| 视频 | pMDDL2450 MIMO | Microhard | 1,200 ×2 | Calgary |
| 卫星备份 | Iridium Certus 9770 | NAL/Honeywell | 2,800 | US |
| LTE | Cradlepoint W1850 | Cradlepoint | 1,100 | US |
| 主载荷 | Workswell Wiris Pro Sc | Workswell s.r.o. | 28,000 | Czech (FLIR core) |
| 备选载荷 | FLIR Hadron 640R 模组 | Teledyne FLIR | 5,500 | US |
| LiDAR | Ouster OS0-128 | Ouster | 8,500 | US |
| 立体视觉 | RealSense D457 | Intel | 950 | — |
| ADS-B | uAvionix pingRX Pro | uAvionix | 850 | US |
| 回收伞 | ParaZero SafeAir Pro 25 | ParaZero | 6,500 | Israel/US |
| 机体材料 | 碳纤维 / 钛接头 / 7075 | 国内供应链 | 4,500 | — |
| GCS 平板 | Getac F110-G7 | Getac | 4,200 | US/TW;加拿大渠道 |
| GCS modem + antenna 桅杆 | Microhard + 自制 | — | 3,000 | — |

:::

### 12.2 供应商短名单(西方/盟友为主)

| 类别 | 候选 |
|---|---|
| 飞控 | Holybro (TW), CubePilot (AU) |
| 伴飞 PC | NVIDIA + ConnectTech (Guelph, ON), Auvidea (DE) |
| 电机 / ESC | KDE Direct (US),Plettenberg (DE) |
| RF | Microhard (Calgary), RFD (AU), Silvus (US), Doodle Labs (US) |
| Sat | NAL (UK), Honeywell, ViaSat |
| LiDAR | Ouster (US, formerly merged with Velodyne), Hesai (CN, 商业版) |
| 视觉 | Intel RealSense, Stereolabs (FR) |
| 吊舱 | Workswell (CZ), Teledyne FLIR (US), Octopus ISR (CA) |
| 伞 | ParaZero (IL), Mars Parachutes (US), Avss (CA) |
| 电池 | Panasonic JP, LG Energy KR, Samsung SDI KR |
| GCS | Getac (TW), Panasonic Toughbook |
| 云 | AWS Canada Central, GC Cloud |
| 网安审计 | Bulletproof Solutions (NB, CA),KPMG Canada |

### 12.3 里程碑路线图(指示性)

| 月 | 里程碑 |
|---|---|
| M0 (2026-Q2) | 需求冻结(本文档 v1.0) |
| M3 | 飞控+伴飞 SITL 集成完毕 |
| M5 | 整机首飞(VLOS) |
| M7 | LC1 飞行员认证 + RPOC 设立 |
| M9 | BVLOS 试飞(NRC BVLOS map 内的合规区域) |
| M11 | Boreal 数据集 ≥ 200 hr |
| M12 | Hinton GRID 评估通过 |
| M14 | 第三方环境/电池/网安测试完毕 |
| M15 | TC PVD 提交 |
| M18 | PVD 通过 + 上市发布 v1.0 |
| M24 | 量产 v1.1(VTOL Hybrid 延伸版) |

---

## 13. 文档维护 (Document Control)

| 版本 | 日期 | 变更摘要 | 作者 |
|---|---|---|---|
| 0.1 (Draft) | 2026-04-20 | 初稿框架 | RSE Team |
| 0.5 (Internal Review) | 2026-04-23 | 加入 SOR/2025-70 全面合规章节 | RSE + RA |
| **1.0** | **2026-04-25** | **首次正式发布** | **Project Lead** |

::: info 签字栏 (Sign-off)
Chief Engineer · Accountable Executive (per RPOC) · Quality Manager · Compliance Lead · Cybersecurity Lead · Privacy Officer
:::

---

## 14. 参考文档 (Reference Documents)

### 14.1 加拿大法规与标准
1. **Canadian Aviation Regulations (CARs) Part IX** — Remotely Piloted Aircraft Systems(SOR/96-433,经 SOR/2019-11、SOR/2025-70、SOR/2025-226 多次修订) ([Justice Laws](https://laws-lois.justice.gc.ca/eng/regulations/sor-96-433/page-112.html))
2. **SOR/2025-70**《Regulations Amending the Canadian Aviation Regulations (RPAS – BVLOS and Other Operations)》— 全面生效日 2025-11-04 ([MLT Aikins](https://www.mltaikins.com/insights/flying-into-the-future-what-drone-regulation-changes-mean-for-canadians/))
3. **Standard 922 — RPAS Safety Assurance**(Department of Transport, 2025 修订版本) ([Justice Laws](https://laws-lois.justice.gc.ca/eng/regulations/sor-96-433/page-112.html))
4. **Advisory Circular AC 901-001** — RPAS Safety Assurance Declaration and Pre-Validated Declaration Processes ([Transport Canada](https://tc.canada.ca/en/aviation/drone-safety/submitting-drone-safety-assurance-declaration/apply-pre-validated-declaration))
5. **Advisory Circular AC 922-001** — RPAS Safety Assurance verification testing ([AVSS](https://avss.co/2025/04/https-www-avss-co-2025-04-o-transport-canada-new-canadian-drone-rules-for-bvlos-150kg-drones-microdrones-and-more-with-full-implementation-by-tuesday-november-4th-2025-2/))
6. **Advisory Circular AC 903-001** — Atypical airspace operations
7. **Standard 923 — Vision-Based DAA**(可选替代 922.10) ([AVSS](https://avss.co/2025/04/https-www-avss-co-2025-04-o-transport-canada-new-canadian-drone-rules-for-bvlos-150kg-drones-microdrones-and-more-with-full-implementation-by-tuesday-november-4th-2025-2/))
8. **CARs 601.15** — 限制野火 5 NM / 3000 ft AGL 内运行(NOTAM)
9. **CARs 901.198–199** — Service Difficulty Reporting (SDR)
10. **ISED RSS-Gen** — General Requirements for Compliance of Radio Apparatus
11. **ISED RSS-247 Issue 3** — Digital Transmission Systems, FHSS, LE-LAN(902–928 MHz、2400–2483.5 MHz、5150–5895 MHz)
12. **ISED RSS-210** — License-Exempt Radio Apparatus
13. **ISED RSS-119** — Land Mobile and Fixed Radio (含 C2 上行许可频段)
14. **ISED ICES-003** — Information Technology Equipment(EMC)
15. **PIPEDA**(联邦)、**Alberta PIPA**、**BC PIPA**、**Quebec Law 25**(收集影像数据的隐私义务)
16. **Bill C-27** — Digital Charter Implementation Act(2026 年 4 月仍在国会议程,需跟踪)
17. **Official Languages Act**(联邦双语标识与文档要求)
18. **Quebec Bill 96** — Charter of the French Language(销往魁省的产品 UI/标签法语优先)
19. **TPM-PIN-2025-03**(政府采购数据主权指令,与 RCMP 中国 RPAS 限制立场一致) ([CBC News](https://www.cbc.ca/news/politics/rcmp-restricts-chinese-drones-9.6999268))

### 14.2 国际与行业标准
- **UN 38.3** — 锂电池运输测试
- **UL 2271** — 轻型电动车用锂电池(>1 kWh 推荐)
- **ASTM F3322** — Standard Specification for Small UAS Parachutes ([UST](https://www.unmannedsystemstechnology.com/2019/07/safeair-uas-parachutes-certified-in-canada-for-flight-over-people/))
- **ASTM F3478** — UAS Operations Risk Classification
- **RTCA DO-160G** — Environmental Conditions and Test Procedures(振动 / 温度 / EMI / HIRF 借鉴)
- **RTCA DO-178C / DO-254**(可选,作为高保证软件/硬件证据)
- **JARUS SORA 2.5** — Specific Operations Risk Assessment(BVLOS 风险评估方法)
- **ISO/IEC 27001**(云服务信息安全管理)
- **NIST SP 800-53 Rev. 5** / **CIS Controls v8**(网络安全)
- **CycloneDX 1.6 / SPDX 2.3**(SBOM 格式)
- **NIST Aerial Drone Test Methods for Wildfire Thermal Identification** ([NIST](https://www.nist.gov/publications/adapting-nist-aerial-drone-tests-thermal-identification-inspection-and-suppression))

### 14.3 省级 / 行业采购参考
- **Alberta Wildfire — Hinton (Cache Percotte) GRID Testing**(IR 服务供应商必备资质,跨省承认) ([Mugglehead](https://mugglehead.com/volatus-aerospace-cleared-to-help-fight-wildfires-in-alberta/))
- **Government of Alberta — Flight Readiness Certificate (FRC)**(RPAS 上岗前的政府内部审批)
- **BC Wildfire Service** 夜间 IR 扫描合同典型规格(BVLOS 6–8 km、9 PM–6 AM 工作窗口) ([Radio NL](https://www.radionl.com/2025/09/08/b-c-drone-company-wxpanding-to-kamloops-eyes-future-of-firefighting-and-training/))
- **SOPFEU** aerial operations ([SOPFEU](https://www.sopfeu.qc.ca/en/about-us/aerial-operations/))

### 14.4 硬件与数据集参考
- Holybro Pixhawk 6X: ([Holybro](https://holybro.com/products/pixhawk-6x))
- Microhard pDDL2450 数据手册: ([Microhard](https://www.microhardcorp.com/pDDL.php))
- FLAME 数据集(NAU): ([IEEE DataPort](https://ieee-dataport.org/open-access/flame-dataset-aerial-imagery-pile-burn-detection-using-drones-uavs))
- FLAME 2 数据集(NAU): ([NAU](https://experts.nau.edu/en/datasets/flame-2-fire-detection-and-modeling-aerial-multi-spectral-image-d/))
- Volatus Aerospace wildfire drone services: ([Volatus](https://volatusaerospace.com/wildfire-drone-services/))

---

**导出说明 (Export Note)**:本文档以 Markdown 撰写,含标准表格、列表与标题层级,可直接通过 `pandoc` 一键转换为 `.docx`(命令示例 `pandoc AT-RSD-FS-2026-001.md -o AT-RSD-FS-2026-001.docx --reference-doc=corp_template.docx`)与 `.md` 双份交付物。所有规范引用日期截至 2026-04-25,后续应每季度更新 SOR、AC、ISED REL 与省级采购规则。