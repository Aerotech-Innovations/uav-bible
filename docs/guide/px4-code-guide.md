# PX4 源码入门指南

## `boards/` 目录

`boards/` 是**硬件板级支持包（BSP）目录**，每个子文件夹对应一款具体的飞控硬件，按**厂商 → 具体板子**两级组织。

```
boards/
├── px4/
│   ├── fmu-v5/        # Pixhawk 4
│   ├── fmu-v5x/       # Pixhawk 5X
│   ├── fmu-v6x/       # Pixhawk 6X
│   └── ...
├── holybro/
├── cubepilot/
├── modalai/
└── ...
```

### 每个板子文件夹的内容

| 文件 | 作用 |
|---|---|
| `default.px4board` | 该板默认编译哪些模块 |
| `init.d/` | 飞控上电后自动执行的启动脚本 |
| `src/` | 该板专属的驱动或硬件抽象代码 |
| `CMakeLists.txt` | 编译系统入口 |

### 常用板子对应关系

| 硬件型号 | boards 路径 | 编译命令 |
|---|---|---|
| Pixhawk 4 | `boards/px4/fmu-v5/` | `make px4_fmu-v5_default` |
| Pixhawk 5X | `boards/px4/fmu-v5x/` | `make px4_fmu-v5x_default` |
| Pixhawk 6X | `boards/px4/fmu-v6x/` | `make px4_fmu-v6x_default` |

::: info
编译时必须指定目标板。`boards/` 里没有对应文件夹的硬件，就无法编译固件。
:::

---

## `.px4board` 与旧版 CMake 配置的区别

PX4 早期用手写 CMake 来控制模块开关，后来迁移到基于 **Kconfig** 的 `.px4board` 配置系统（与 Linux 内核使用相同机制）。

### 旧版（CMake）

模块开关分散在各板的 `CMakeLists.txt` 里，语法为 CMake，各板写法不统一：

```cmake
set(config_module_list
    drivers/imu/bmi088
    modules/ekf2
    ...
)
```

### 新版（`.px4board` / Kconfig）

统一写在 `default.px4board`，语法简洁：

```
CONFIG_MODULES_EKF2=y
CONFIG_DRIVERS_IMU_BMI088=y
CONFIG_DRIVERS_GPS=y
```

### 对比

| 对比项 | 旧版 CMake | 新版 `.px4board` (Kconfig) |
|---|---|---|
| 语法 | CMake | Kconfig |
| 可视化配置 | 不支持 | 支持 `make menuconfig` |
| 依赖管理 | 手动 | 自动 |
| 各板一致性 | 不统一 | 统一格式 |

::: tip
新版支持图形界面交互式开关模块，裁剪固件时非常方便：

```bash
make px4_fmu-v6x_default menuconfig
```
:::
