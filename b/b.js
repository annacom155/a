document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const loginPrompt = document.getElementById('login-prompt');
    const usernameDisplay = document.getElementById('username-display');
    const usernameCursor = document.getElementById('username-cursor');
    const prompt = document.getElementById('prompt');
    const commandCursor = document.getElementById('command-cursor');
    
    // 更真实的启动消息
    const bootMessages = [
        {text: "[    0.000000] microcode: microcode updated early to revision 0xde, date = 2022-06-14", delay: 50, type: "info"},
        {text: "[    0.000000] Linux version 5.15.0-86-generic (buildd@lcy02-amd64-090) (gcc (Ubuntu 11.3.0-1ubuntu1~22.04) 11.3.0, GNU ld (GNU Binutils for Ubuntu) 2.38) #96-Ubuntu SMP Wed Sep 20 08:23:49 UTC 2023 (Ubuntu 5.15.0-86.96-generic 5.15.74)", delay: 100, type: "info"},
        {text: "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-5.15.0-86-generic root=UUID=1a2b3c4d-5e6f-7890-abcd-ef1234567890 ro quiet splash vt.handoff=7", delay: 80, type: "info"},
        {text: "[    0.000000] KERNEL supported cpus:", delay: 60, type: "info"},
        {text: "[    0.000000]   Intel GenuineIntel", delay: 40, type: "info"},
        {text: "[    0.000000]   AMD AuthenticAMD", delay: 40, type: "info"},
        {text: "[    0.000000]   Centaur CentaurHauls", delay: 40, type: "info"},
        {text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'", delay: 70, type: "info"},
        {text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'", delay: 60, type: "info"},
        {text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'", delay: 60, type: "info"},
        {text: "[    0.000000] x86/fpu: xstate_offset[2]:  576, xstate_sizes[2]:  256", delay: 50, type: "info"},
        {text: "[    0.000000] BIOS-provided physical RAM map:", delay: 80, type: "info"},
        {text: "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable", delay: 70, type: "info"},
        {text: "[    0.000000] BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved", delay: 70, type: "info"},
        {text: "[    0.000000] BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved", delay: 70, type: "info"},
        {text: "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000007ffd7fff] usable", delay: 70, type: "info"},
        {text: "[    0.000000] NX (Execute Disable) protection: active", delay: 90, type: "info"},
        {text: "[    0.000000] SMBIOS 2.8 present.", delay: 100, type: "info"},
        {text: "[    0.000000] DMI: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.14.0-2 04/01/2014", delay: 120, type: "info"},
        {text: "[    0.000000] Hypervisor detected: KVM", delay: 150, type: "info"},
        {text: "[    0.000000] kvm-clock: Using msrs 4b564d01 and 4b564d00", delay: 100, type: "info"},
        {text: "[    0.000000] kvm-clock: cpu 0, msr 1c01001, primary cpu clock", delay: 90, type: "info"},
        {text: "[    0.000000] kvm-clock: using sched offset of 6819913026 cycles", delay: 110, type: "info"},
        {text: "[    0.000003] clocksource: kvm-clock: mask: 0xffffffffffffffff max_cycles: 0x1cd42e4dffb, max_idle_ns: 881590591483 ns", delay: 130, type: "info"},
        {text: "[    0.000005] tsc: Detected 2399.998 MHz processor", delay: 140, type: "info"},
        {text: "[    0.262894] console [tty0] enabled", delay: 200, type: "info"},
        {text: "[    0.264567] ACPI: Core revision 20210730", delay: 100, type: "info"},
        {text: "[    0.272345] PCI: Using configuration type 1 for base access", delay: 120, type: "info"},
        {text: "[    0.276543] virtio-pci 0000:00:01.0: virtio_pci: leaving for legacy driver", delay: 150, type: "info"},
        {text: "[    0.280123] NET: Registered PF_INET6 protocol family", delay: 130, type: "info"},
        {text: "[    0.987654] EXT4-fs (sda1): mounted filesystem with ordered data mode. Quota mode: none.", delay: 300, type: "ok"},
        {text: "[    1.234567] systemd[1]: systemd 249.11-0ubuntu3.9 running in system mode (+PAM +AUDIT +SELINUX +APPARMOR +IMA +SMACK +SECCOMP +GCRYPT +GNUTLS +OPENSSL +ACL +BLKID +CURL +ELFUTILS +FIDO2 +IDN2 -IDN +IPTC +KMOD +LIBCRYPTSETUP +LIBFDISK +PCRE2 -PWQUALITY -P11KIT -QRENCODE +BZIP2 +LZ4 +XZ +ZLIB +ZSTD -XKBCOMMON +UTMP +SYSVINIT default-hierarchy=unified)", delay: 400, type: "info"},
        {text: "[    1.345678] systemd[1]: Detected virtualization kvm.", delay: 200, type: "info"},
        {text: "[    1.456789] systemd[1]: Detected architecture x86-64.", delay: 200, type: "info"},
        {text: "[  OK  ] Created slice system-modprobe.slice.", delay: 150, type: "ok"},
        {text: "[  OK  ] Created slice system-serial\x2dgetty.slice.", delay: 150, type: "ok"},
        {text: "[  OK  ] Created slice User and Session Slice.", delay: 150, type: "ok"},
        {text: "[  OK  ] Started Dispatch Password Requests to Console Directory Watch.", delay: 150, type: "ok"},
        {text: "[  OK  ] Started Forward Password Requests to Wall Directory Watch.", delay: 150, type: "ok"},
        {text: "[  OK  ] Reached target Paths.", delay: 120, type: "ok"},
        {text: "[  OK  ] Reached target Remote File Systems.", delay: 120, type: "ok"},
        {text: "[  OK  ] Reached target Slice Units.", delay: 120, type: "ok"},
        {text: "[  OK  ] Reached target Swaps.", delay: 120, type: "ok"},
        {text: "[  OK  ] Started Journal Service.", delay: 180, type: "ok"},
        {text: "[  OK  ] Started Load/Save Random Seed.", delay: 160, type: "ok"},
        {text: "[  OK  ] Started Create Volatile Files and Directories.", delay: 160, type: "ok"},
        {text: "[  OK  ] Reached target System Initialization.", delay: 200, type: "ok"},
        {text: "[  OK  ] Started Daily Cleanup of Temporary Directories.", delay: 180, type: "ok"},
        {text: "[  OK  ] Reached target Timers.", delay: 150, type: "ok"},
        {text: "[  OK  ] Listening on D-Bus System Message Bus Socket.", delay: 180, type: "ok"},
        {text: "[  OK  ] Listening on UUID daemon activation socket.", delay: 180, type: "ok"},
        {text: "[  OK  ] Reached target Sockets.", delay: 150, type: "ok"},
        {text: "[  OK  ] Reached target Basic System.", delay: 200, type: "ok"},
        {text: "[  OK  ] Started Regular background program processing daemon.", delay: 220, type: "ok"},
        {text: "[  OK  ] Started D-Bus System Message Bus.", delay: 200, type: "ok"},
        {text: "[  OK  ] Started Network Manager.", delay: 250, type: "ok"},
        {text: "[  OK  ] Reached target Network.", delay: 180, type: "ok"},
        {text: "[  OK  ] Reached target Network is Online.", delay: 200, type: "ok"},
        {text: "[  OK  ] Started OpenBSD Secure Shell server.", delay: 220, type: "ok"},
        {text: "[  OK  ] Started Permit User Sessions.", delay: 180, type: "ok"},
        {text: "[  OK  ] Started Hostname Service.", delay: 200, type: "ok"},
        {text: "[  OK  ] Reached target Multi-User System.", delay: 250, type: "ok"},
        {text: "[  OK  ] Reached target Graphical Interface.", delay: 300, type: "ok"},
        {text: "         Starting Update UTMP about System Runlevel Changes...", delay: 280, type: "info"},
        {text: "[  OK  ] Started Update UTMP about System Runlevel Changes.", delay: 320, type: "ok"}
    ];
    
    let messageIndex = 0;
    let progress = 0;
    
    // 添加消息
    function addMessage(text, type = "info") {
        const messageElement = document.createElement('div');
        messageElement.className = `log-line ${type}`;
        messageElement.textContent = text;
        body.appendChild(messageElement);
        
        // 滚动到底部
        window.scrollTo(0, document.body.scrollHeight);
    }
    
    // 模拟启动过程
    function simulateBoot() {
        if (messageIndex < bootMessages.length) {
            const message = bootMessages[messageIndex];
            
            setTimeout(() => {
                addMessage(message.text, message.type);
                
                // 更新进度
                progress = Math.min(100, Math.round((messageIndex + 1) / bootMessages.length * 100));
                
                // 创建进度条（如果不存在）
                let progressContainer = document.querySelector('.progress-container');
                if (!progressContainer) {
                    progressContainer = document.createElement('div');
                    progressContainer.className = 'progress-container';
                    const progressBar = document.createElement('div');
                    progressBar.className = 'progress-bar';
                    progressBar.id = 'progress-bar';
                    progressContainer.appendChild(progressBar);
                    body.appendChild(progressContainer);
                }
                
                // 更新进度条
                document.getElementById('progress-bar').style.width = `${progress}%`;
                
                messageIndex++;
                simulateBoot();
            }, message.delay);
        } else {
            // 显示登录提示
            setTimeout(() => {
                loginPrompt.style.display = 'block';
                simulateLogin();
            }, 1000);
        }
    }
    
    // 模拟登录
    function simulateLogin() {
        let index = 0;
        const username = "user";
        
        const typeInterval = setInterval(() => {
            if (index < username.length) {
                usernameDisplay.textContent += username.charAt(index);
                index++;
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                clearInterval(typeInterval);
                
                // 登录完成
                setTimeout(() => {
                    usernameCursor.style.display = 'none';
                    
                    // 添加密码行
                    addMessage("Password: *******", "info");
                    
                    // 显示登录成功
                    setTimeout(() => {
                        addMessage("", "info");
                        addMessage("Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-86-generic x86_64)", "info");
                        addMessage("", "info");
                        addMessage("Last login: Mon Oct 16 14:30:22 UTC 2023 on tty1", "info");
                        addMessage("", "info");
                        
                        // 显示命令提示符
                        setTimeout(() => {
                            prompt.style.display = 'block';
                            
                            // 模拟输入命令
                            setTimeout(() => {
                                simulateCommand("systemctl --no-pager");
                            }, 1000);
                        }, 800);
                    }, 800);
                }, 800);
            }
        }, 100);
    }
    
    // 模拟命令执行
    function simulateCommand(command) {
        const promptLine = document.createElement('div');
        promptLine.innerHTML = `<span class="prompt-user">user</span><span class="prompt-symbol">@</span><span class="prompt-host">ubuntu</span><span class="prompt-symbol">:</span><span class="prompt-dir">~</span><span class="prompt-symbol">$ </span>${command}`;
        body.appendChild(promptLine);
        
        // 命令"执行"时隐藏光标
        commandCursor.style.display = 'none';
        
        // 模拟命令输出
        setTimeout(() => {
            const outputLines = [
                "  UNIT                                                                          LOAD   ACTIVE SUB       DESCRIPTION",
                "  sys-devices-pci0000:00-0000:00:01.0-virtio1-net-eth0.device                  loaded active plugged   Virtio network device",
                "  sys-devices-pci0000:00-0000:00:02.0-virtio2-block-vda-vda1.device             loaded active plugged   /sys/devices/pci0000:00/0000:00:02.0/virtio2/block/vda/vda1",
                "  sys-devices-pci0000:00-0000:00:02.0-virtio2-block-vda.device                  loaded active plugged   Virtio block device",
                "  sys-devices-platform-serial8250-tty-ttyS0.device                              loaded active plugged   /sys/devices/platform/serial8250/tty/ttyS0",
                "  sys-devices-platform-serial8250-tty-ttyS1.device                              loaded active plugged   /sys/devices/platform/serial8250/tty/ttyS1",
                "  sys-devices-platform-serial8250-tty-ttyS2.device                              loaded active plugged   /sys/devices/platform/serial8250/tty/ttyS2",
                "  sys-devices-platform-serial8250-tty-ttyS3.device                              loaded active plugged   /sys/devices/platform/serial8250/tty/ttyS3",
                "  sys-module-fuse.device                                                        loaded active plugged   /sys/module/fuse",
                "  -.mount                                                                       loaded active mounted   Root Mount",
                "  dev-hugepages.mount                                                           loaded active mounted   Huge Pages File System",
                "  dev-mqueue.mount                                                              loaded active mounted   POSIX Message Queue File System",
                "  run-user-1000.mount                                                           loaded active mounted   /run/user/1000",
                "  snap-core20-1822.mount                                                        loaded active mounted   Mount unit for core20",
                "  snap-lxd-22753.mount                                                          loaded active mounted   Mount unit for lxd",
                "  snap-snapd-18357.mount                                                        loaded active mounted   Mount unit for snapd",
                "  systemd-ask-password-console.path                                             loaded active waiting   Dispatch Password Requests to Console Directory Watch",
                "  systemd-ask-password-wall.path                                                 loaded active waiting   Forward Password Requests to Wall Directory Watch",
                "",
                "LOAD   = Reflects whether the unit definition was properly loaded.",
                "ACTIVE = The high-level unit activation state, i.e. generalization of SUB.",
                "SUB    = The low-level unit activation state, values depend on unit type.",
                "",
                "209 loaded units listed."
            ];
            
            outputLines.forEach(line => {
                const outputLine = document.createElement('div');
                outputLine.textContent = line;
                outputLine.className = 'log-line';
                body.appendChild(outputLine);
            });
            
            // 再次显示光标
            setTimeout(() => {
                commandCursor.style.display = 'inline-block';
                window.scrollTo(0, document.body.scrollHeight);
                
                // 自动跳转
                setTimeout(() => {
                    window.location.href = "/a/a.html";
                }, 2000);
            }, 500);
        }, 800);
    }
    
    // 开始启动模拟
    setTimeout(simulateBoot, 500);
});
