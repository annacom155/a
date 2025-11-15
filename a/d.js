
        // 硬件信息模拟器
        class HardwareMonitor {
            constructor() {
                this.cpuUsage = 0;
                this.memoryUsage = 0;
                this.diskUsage = 0;
                this.temperature = 0;
                this.networkUpload = [];
                this.networkDownload = [];
                this.processCount = 0;
                this.startTime = Date.now();
                
                // 初始化网络数据
                for (let i = 0; i < 50; i++) {
                    this.networkUpload.push(0);
                    this.networkDownload.push(0);
                }
            }
            
            update() {
                // 模拟CPU使用率波动
                this.cpuUsage = Math.max(5, Math.min(100, 
                    this.cpuUsage + (Math.random() - 0.5) * 10
                ));
                
                // 模拟内存使用率
                this.memoryUsage = Math.max(20, Math.min(85, 
                    this.memoryUsage + (Math.random() - 0.3) * 5
                ));
                
                // 模拟磁盘使用率（变化较慢）
                if (Math.random() < 0.1) {
                    this.diskUsage = Math.max(30, Math.min(90, 
                        this.diskUsage + (Math.random() - 0.5) * 2
                    ));
                }
                
                // 模拟温度变化
                this.temperature = Math.max(35, Math.min(75, 
                    this.temperature + (Math.random() - 0.4) * 2
                ));
                
                // 模拟网络流量
                this.networkUpload.shift();
                this.networkDownload.shift();
                this.networkUpload.push(Math.random() * 100);
                this.networkDownload.push(Math.random() * 80);
                
                // 模拟进程数量变化
                this.processCount = Math.max(150, Math.min(300, 
                    this.processCount + Math.round((Math.random() - 0.5) * 5)
                ));
            }
            
            getFormattedMemory() {
                const total = 16; // 16GB 总内存
                const used = (total * this.memoryUsage / 100).toFixed(1);
                return `${used} GB / ${total} GB`;
            }
            
            getFormattedDisk() {
                const total = 512; // 512GB 总磁盘
                const used = (total * this.diskUsage / 100).toFixed(0);
                return `${used} GB / ${total} GB`;
            }
            
            getNetworkSpeed() {
                const upload = this.networkUpload[this.networkUpload.length - 1];
                const download = this.networkDownload[this.networkDownload.length - 1];
                return `↑${upload.toFixed(0)} ↓${download.toFixed(0)} KB/s`;
            }
            
            getUptime() {
                const seconds = Math.floor((Date.now() - this.startTime) / 1000);
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }

        // 齿轮类定义
        class Gear {
            constructor(x, y, radius, teeth, color, speed) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.teeth = teeth;
                this.color = color;
                this.speed = speed;
                this.angle = 0;
            }
            
            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                
                // 绘制齿轮主体
                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // 绘制齿轮齿
                const toothDepth = this.radius * 0.2;
                const toothWidth = (Math.PI * 2) / this.teeth * 0.4;
                for (let i = 0; i < this.teeth; i++) {
                    const angle = (i / this.teeth) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.radius + toothDepth, angle - toothWidth / 2, angle + toothWidth / 2);
                    ctx.arc(0, 0, this.radius - toothDepth / 2, angle + toothWidth / 2, angle - toothWidth / 2, true);
                    ctx.closePath();
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                
                // 绘制中心圆
                ctx.beginPath();
                ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // 绘制中心点
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.restore();
            }
            
            update() {
                this.angle += this.speed;
            }
        }
        
        // 性能图表类
        class PerformanceChart {
            constructor(canvasId, maxDataPoints = 100) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                this.data = [];
                this.maxDataPoints = maxDataPoints;
                this.lastMarkTime = 0;
                this.markInterval = 300;
            }
            
            addDataPoint(fps) {
                this.data.push(fps);
                if (this.data.length > this.maxDataPoints) {
                    this.data.shift();
                }
            }
            
            draw() {
                const ctx = this.ctx;
                const width = this.canvas.width;
                const height = this.canvas.height;
                
                ctx.clearRect(0, 0, width, height);
                this.drawGrid();
                
                if (this.data.length > 1) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#FF0000';
                    ctx.lineWidth = 2;
                    const xStep = width / (this.maxDataPoints - 1);
                    const maxFPS = Math.max(...this.data, 60);
                    
                    for (let i = 0; i < this.data.length; i++) {
                        const x = i * xStep;
                        const y = height - (this.data[i] / maxFPS) * height;
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.stroke();
                }
                
                const currentTime = performance.now();
                if (currentTime - this.lastMarkTime >= this.markInterval) {
                    this.addMark();
                    this.lastMarkTime = currentTime;
                }
            }
            
            drawGrid() {
                const ctx = this.ctx;
                const width = this.canvas.width;
                const height = this.canvas.height;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
                
                for (let i = 0; i <= 5; i++) {
                    const y = i * (height / 5);
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.font = '10px Arial';
                    ctx.fillText(`${60 - i * 12}`, 5, y - 2);
                }
            }
            
            addMark() {
                const ctx = this.ctx;
                const height = this.canvas.height;
                ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
                ctx.fillRect(this.canvas.width - 2, 0, 2, height);
            }
        }
        
        // 齿轮动画控制器
        class GearAnimation {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                this.gear = new Gear(
                    this.canvas.width / 2, 
                    this.canvas.height / 2, 
                    80, 16, '#808080', 0.02
                );
                this.animationId = null;
                
                // 帧率计算
                this.fps = 0;
                this.frameCount = 0;
                this.lastTime = performance.now();
                this.fpsCounter = document.getElementById('fpsCounter');
                
                // 性能图表
                this.chart = new PerformanceChart('chartCanvas');
                
                // 硬件监控
                this.hardwareMonitor = new HardwareMonitor();
                
                // 压力指示器
                this.stressFill = document.getElementById('stressFill');
                this.stressLabel = document.getElementById('stressLabel');
                
                // 压力测试相关变量
                this.stressStartTime = 0;
                this.stressDuration = 0;
                this.isStressing = false;
                this.stressIntensity = 0;
                this.stressInterval = 4000;
                this.lastStressTime = 0;
                this.heavyCalculationResult = 0;
                
                this.animate();
            }
            
            simulateModerateStress() {
                const currentTime = performance.now();
                
                if (currentTime - this.lastStressTime > this.stressInterval) {
                    this.isStressing = true;
                    this.stressStartTime = currentTime;
                    this.stressDuration = 800 + Math.random() * 1200;
                    this.stressIntensity = 5000 + Math.random() * 15000;
                    this.lastStressTime = currentTime;
                }
                
                if (this.isStressing) {
                    const elapsed = currentTime - this.stressStartTime;
                    const progress = Math.min(elapsed / this.stressDuration, 1);
                    
                    this.updateStressIndicator(progress);
                    
                    if (elapsed < this.stressDuration) {
                        let tempResult = 0;
                        for (let i = 0; i < this.stressIntensity; i++) {
                            tempResult += Math.sqrt(i) * Math.sin(i * 0.1) * Math.cos(i * 0.05);
                        }
                        this.heavyCalculationResult = tempResult;
                    } else {
                        this.isStressing = false;
                        this.updateStressIndicator(0);
                    }
                } else {
                    this.updateStressIndicator(0);
                }
                return this.heavyCalculationResult;
            }
            
            updateStressIndicator(progress) {
                const fillHeight = progress * 100;
                this.stressFill.style.height = `${fillHeight}%`;
                
                if (fillHeight < 30) {
                    this.stressLabel.style.color = '#4ECDC4';
                } else if (fillHeight < 70) {
                    this.stressLabel.style.color = '#FFA500';
                } else {
                    this.stressLabel.style.color = '#FF0000';
                }
                
                if (fillHeight > 0) {
                    this.stressLabel.textContent = `CPU 负载: ${Math.round(fillHeight)}%`;
                } else {
                    this.stressLabel.textContent = 'CPU 负载';
                }
            }
            
            updateHardwareDisplay() {
                // 更新硬件监控数据
                this.hardwareMonitor.update();
                
                // 更新UI显示
                document.getElementById('cpuUsage').textContent = `${Math.round(this.hardwareMonitor.cpuUsage)}%`;
                document.getElementById('cpuProgress').style.width = `${this.hardwareMonitor.cpuUsage}%`;
                
                document.getElementById('memUsage').textContent = this.hardwareMonitor.getFormattedMemory();
                document.getElementById('memProgress').style.width = `${this.hardwareMonitor.memoryUsage}%`;
                
                document.getElementById('diskUsage').textContent = this.hardwareMonitor.getFormattedDisk();
                document.getElementById('diskProgress').style.width = `${this.hardwareMonitor.diskUsage}%`;
                
                document.getElementById('tempValue').textContent = `${Math.round(this.hardwareMonitor.temperature)}°C`;
                document.getElementById('networkSpeed').textContent = this.hardwareMonitor.getNetworkSpeed();
                document.getElementById('processCount').textContent = this.hardwareMonitor.processCount;
                document.getElementById('uptime').textContent = this.hardwareMonitor.getUptime();
                
                // 更新网络图
                this.drawNetworkGraph();
            }
            
            drawNetworkGraph() {
                const graph = document.getElementById('networkGraph');
                graph.innerHTML = '';
                
                const uploadData = this.hardwareMonitor.networkUpload;
                const downloadData = this.hardwareMonitor.networkDownload;
                const width = graph.offsetWidth;
                const height = graph.offsetHeight;
                const barWidth = width / uploadData.length;
                
                for (let i = 0; i < uploadData.length; i++) {
                    const uploadBar = document.createElement('div');
                    uploadBar.className = 'network-upload';
                    uploadBar.style.left = `${i * barWidth}px`;
                    uploadBar.style.height = `${uploadData[i] * 0.3}px`;
                    graph.appendChild(uploadBar);
                    
                    const downloadBar = document.createElement('div');
                    downloadBar.className = 'network-download';
                    downloadBar.style.left = `${i * barWidth}px`;
                    downloadBar.style.bottom = '0';
                    downloadBar.style.height = `${downloadData[i] * 0.3}px`;
                    graph.appendChild(downloadBar);
                }
            }
            
            animate() {
                this.animationId = requestAnimationFrame(() => this.animate());
                
                this.updateFPS();
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.simulateModerateStress();
                this.updateHardwareDisplay();
                
                this.gear.update();
                this.gear.draw(this.ctx);
                
                this.chart.addDataPoint(this.fps);
                this.chart.draw();
            }
            
            updateFPS() {
                this.frameCount++;
                const currentTime = performance.now();
                if (currentTime >= this.lastTime + 1000) {
                    this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                    this.frameCount = 0;
                    this.lastTime = currentTime;
                    
                    if (this.isStressing) {
                        this.fps = Math.max(20, this.fps - Math.floor(Math.random() * 25 + 10));
                    }
                    
                    this.fpsCounter.textContent = `FPS: ${this.fps}`;
                    this.fpsCounter.style.color = this.fps > 50 ? '#4ECDC4' : 
                                                this.fps > 30 ? '#FFA500' : '#FF0000';
                }
            }
        }

        // 页面加载完成后初始化
        window.addEventListener('DOMContentLoaded', () => {
            new GearAnimation('gearCanvas');
        });
 