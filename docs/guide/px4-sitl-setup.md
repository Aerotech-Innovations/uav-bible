# PX4 SITL Development Environment Setup

> **Platform:** macOS (including Apple Silicon M1/M2/M3)
> **PX4 version:** `main` branch (~v1.17)
> **Target hardware:** Pixhawk 6X + X500 V2

---

## Prerequisites

| Tool | Purpose |
|------|---------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Run PX4 build/simulation container |
| [QGroundControl](https://qgroundcontrol.com) | Ground control station — connect to simulated vehicle |
| XQuartz | Only needed if using Gazebo with a GUI window |

Install Docker Desktop and start it (confirm the Docker icon appears in the menu bar).

---

## Step 1 — Clone PX4 Source

```bash
cd ~/projects/aeroinx
git clone https://github.com/PX4/PX4-Autopilot.git --recursive
cd PX4-Autopilot
```

::: warning `--recursive` is mandatory
It pulls all submodules (Gazebo, mavlink, etc.). If you already cloned without it, run:
```bash
git submodule update --init --recursive
```
:::

---

## Step 2 — Pull the PX4 Docker Image

PX4 `main` uses a unified **`px4-dev`** image (Ubuntu 24.04, supports both `amd64` and `arm64`):

```bash
docker pull px4io/px4-dev:v1.17.0-beta1
```

::: tip Apple Silicon
This image natively supports `arm64` — **no Rosetta 2 emulation needed**, and no socket errors from old images.
:::

---

## Step 3 — Run the Simulation

If you previously built with an older version or image, clear the old build first:

```bash
rm -rf ~/projects/aeroinx/PX4-Autopilot/build/
```

### Option A: Headless SIH (Recommended for beginners)

SIH (Software-In-the-Hardware) is PX4's built-in self-contained physics simulator — no Gazebo or external program needed.

```bash
cd ~/projects/aeroinx/PX4-Autopilot

docker run -it --rm \
  -p 18570:18570/udp \
  -p 14540:14540/udp \
  -v $(pwd):/PX4-Autopilot \
  px4io/px4-dev:v1.17.0-beta1 \
  bash -c "cd /PX4-Autopilot && make px4_sitl sihsim_quadx"
```

**Port mapping:**

| Port | Direction | Purpose |
|------|-----------|---------|
| `18570/UDP` | QGC → Docker → PX4 | GCS MAVLink main link |
| `14540/UDP` | External app → Docker → PX4 | Offboard API (MAVSDK / dronekit) |

::: warning Port change in PX4 main
The GCS MAVLink port changed from `14550` to **`18570`** in the `main` branch. Using `-p 14550:14550/udp` causes a `bound address already in use` error in QGC.
:::

#### Connect QGroundControl (first-time setup)

PX4 inside Docker cannot broadcast through the container network to macOS. You need to configure QGC to actively connect:

1. Open QGroundControl
2. **Q icon** → **Application Settings** → **Comm Links**
3. Click **Add** and fill in:
   - **Name:** `PX4-SITL` (any name)
   - **Type:** UDP
   - **Listening Port:** `14556` (any free port, not `14550` or `18570`)
   - **Server Addresses:** click Add → host `localhost`, port `18570` → OK
   - Check **Automatically Connect on Start**
4. Click **OK** → select the link → click **Connect**

QGC sends a heartbeat to PX4, PX4 registers QGC's address and starts streaming — the link is established.

::: tip Reconnecting on subsequent runs
**Q icon → Application Settings → Comm Links → select PX4-SITL → Connect**
:::

---

### Option B: Gazebo Harmonic with GUI

PX4 `main` has switched to **Gazebo Harmonic** (`gz_x500` targets). Gazebo must be installed **natively on macOS** — the Docker image does not include it.

#### 1. Install the build toolchain

```bash
cd ~/projects/aeroinx/PX4-Autopilot
bash ./Tools/setup/macos.sh
```

::: tip Python virtualenv
If you see an `externally-managed-environment` error (normal), run:
```bash
python3 -m venv ~/.px4-venv
source ~/.px4-venv/bin/activate
pip install -r Tools/setup/requirements.txt
```
Activate the venv with `source ~/.px4-venv/bin/activate` before each session.
:::

#### 2. Install Gazebo Harmonic and GStreamer

```bash
brew tap osrf/simulation
brew install gz-harmonic
brew install gstreamer
```

`macos.sh` does **not** install Gazebo — you must install it manually via the OSRF tap. GStreamer is a dependency of the Gazebo camera plugin.

#### 3. Build PX4 SITL

```bash
cd ~/projects/aeroinx/PX4-Autopilot
source ~/.px4-venv/bin/activate
export LIBRARY_PATH="/opt/homebrew/lib:$LIBRARY_PATH"
export DYLD_LIBRARY_PATH="/opt/homebrew/lib:$DYLD_LIBRARY_PATH"
CMAKE_ARGS="-DCMAKE_CXX_FLAGS=-Wno-error=double-promotion" make px4_sitl gz_x500
```

Why the extra flags:
- `LIBRARY_PATH` — linker finds `libgstreamer-1.0.dylib` at build time
- `DYLD_LIBRARY_PATH` — GStreamer plugin scanner finds GLib at runtime
- `-Wno-error=double-promotion` — Apple Clang 21+ treats implicit `float→double` as an error; this downgrades it to a warning

First build takes **15–30 minutes**. Gazebo window and PX4 terminal launch together when done.

#### 4. Subsequent launches

```bash
cd ~/projects/aeroinx/PX4-Autopilot
source ~/.px4-venv/bin/activate
export DYLD_LIBRARY_PATH="/opt/homebrew/lib:$DYLD_LIBRARY_PATH"
make px4_sitl gz_x500
```

After the first build, only `DYLD_LIBRARY_PATH` is needed — `LIBRARY_PATH` and `CMAKE_ARGS` are not required again.

#### Restarting the simulation

```bash
# Normal restart
make px4_sitl gz_x500

# If Gazebo/PX4 processes are lingering
pkill -f gz && pkill -f px4
make px4_sitl gz_x500
```

#### Available worlds

| Command | Description |
|---------|-------------|
| `make px4_sitl gz_x500` | Default empty scene |
| `make px4_sitl gz_x500__baylands` | Realistic terrain and water |
| `make list_config_targets \| grep gz_x500` | List all available x500 worlds |

---

## Step 4 — Verify Connection

Look for these lines in the Docker/PX4 output to confirm it's ready:

```
INFO  [mavlink] mode: Normal, data rate: 4000000 B/s on udp port 18570 remote port 14550
INFO  [commander] Ready for takeoff!
```

In QGroundControl:
- Aircraft icon appears in the top toolbar
- Status shows `Ready To Fly` or `Disarmed`
- HUD artificial horizon responds to simulated attitude

---

## Architecture Overview

```
macOS host                              Docker container (Ubuntu 24.04 arm64)
┌─────────────────────┐                ┌──────────────────────────────────┐
│  QGroundControl     │──UDP 18570 ───▶│  PX4 SITL (mavlink :18570)       │
│  (Comm Link:14556   │◀───────────────│  + SIH built-in physics           │
│   → localhost:18570)│                │                                  │
└─────────────────────┘                └──────────────────────────────────┘

QGC sends heartbeat → Docker NAT forwards → PX4 registers QGC address → streams back
```

---

## Common Simulation Targets

| Command | Description |
|---------|-------------|
| `make px4_sitl sihsim_quadx` | **Recommended headless**: built-in SIH physics, no external simulator |
| `make px4_sitl sihsim_airplane` | SIH fixed-wing |
| `make px4_sitl sihsim_standard_vtol` | SIH VTOL |
| `make px4_sitl gz_x500` | Gazebo Harmonic + X500 (requires local Gazebo install) |
| `make px4_sitl gz_standard_vtol` | Gazebo Harmonic + VTOL |
| `make px4_sitl gazebo-classic_iris` | ⚠️ Legacy Gazebo Classic (deprecated) |
| `make px4_sitl none_iris` | ⚠️ Requires external MAVLink simulator on TCP 4560 — cannot run standalone |

---

## Building Real Firmware (Pixhawk 6X)

Once simulation is validated, compile for hardware:

```bash
cd ~/projects/aeroinx/PX4-Autopilot

docker run -it --rm \
  -v $(pwd):/PX4-Autopilot \
  px4io/px4-dev:v1.17.0-beta1 \
  bash -c "cd /PX4-Autopilot && make px4_fmu-v6x_default"
```

Output firmware: `build/px4_fmu-v6x_default/px4_fmu-v6x_default.px4`

Flash via QGroundControl: **Vehicle Setup → Firmware**.

---

## Troubleshooting

### `UDPLink error: the bound address is already in use`

QGC tries to bind UDP `14550`, but Docker's `-p 14550:14550/udp` already occupies it on the host.

**Fix:** Use `-p 18570:18570/udp` in the Docker command, and manually add a `localhost:18570` UDP Comm Link in QGC (see Step 3).

---

### QGC connects but receives no data (`MAVLink only on localhost`)

PX4 by default only allows MAVLink to `localhost`, so QGC outside Docker receives nothing.

**Fix:** The `10040_sihsim_quadx` airframe file has `param set-default MAV_0_BROADCAST 1` — rebuild to apply. For a quick fix without rebuilding:

```bash
docker exec <container_name> bash -c \
  "cd /PX4-Autopilot/build/px4_sitl_default/rootfs && \
   /PX4-Autopilot/build/px4_sitl_default/bin/px4-param --instance 0 set MAV_0_BROADCAST 1"
```

---

### `error connecting to socket: No such file or directory`

This appears when running the old `px4-dev-simulation-focal` (Ubuntu 20.04, x86_64) image on Apple Silicon.

**Fix:** Switch to `px4io/px4-dev:v1.17.0-beta1` — arm64 native, no `--platform linux/amd64` needed.

---

### Why can't `none_iris` run standalone?

`none_iris` starts `simulator_mavlink` and waits for an external MAVLink simulator on TCP 4560. `none` means "no GUI", not "no simulator". Use `sihsim_quadx` instead.

---

### First build takes too long

Expect 10–30 minutes depending on your Mac. Subsequent builds are much faster due to incremental compilation. Speed up with `ccache`:

```bash
docker run ... --env=CCACHE_DIR=/ccache -v ~/.ccache:/ccache ...
```

---

## References

- [PX4 Documentation](https://docs.px4.io/main/)
- [PX4 Docker Containers](https://docs.px4.io/main/en/test_and_ci/docker.html)
- [QGroundControl](https://qgroundcontrol.com)
