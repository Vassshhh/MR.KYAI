import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    DialogModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // --- Data untuk Progress Stepper ---
  selectedLevel: number = 1;
  levelInfo: any[];

  // --- Data untuk Charts ---
  platformAccessData: any;
  taxRevenueData: any;
  chartOptions: any;
  platformAccessChartOptions: any;

  // --- Data untuk Top Topics Modal ---
  displayTopTopicsModal: boolean = false;
  topicSearchValue: string = '';
  allTopics: any[] = [];
  filteredTopics: any[] = [];

  constructor() {
    // Inisialisasi data untuk level info
    this.levelInfo = [
      {
        level: 1,
        title: 'Level 1: Explorer',
        tasks: [
          'Login Dashboard Sebanyak 3x.',
          'Interaksi dengan AI Agent 3x (Cth. Cek Status Pajak).',
          'Unlocked Feature : Progress bar, Notifikasi, Badge Info.'
        ]
      },
      {
        level: 2,
        title: 'Level 2: Achiever',
        tasks: [
          'Selesaikan 5x Interaksi berbeda dengan dashboard.',
          'Training/Tuning AI Melalui Playground sebanyak 5x.',
          'Unlocked Feature : Stats Detail, Achievement Badge.'
        ]
      },
      {
        level: 3,
        title: 'Level 3: Challenger',
        tasks: [
          'Capai completion rate minimal 80% interaksi dashboard.',
          'Tampil di leaderboard pengguna teraktif.',
          'Unlocked Feature : Leaderboard.'
        ]
      },
      {
        level: 4,
        title: 'Level 4: Expert',
        tasks: [
          'Berikan bantuan atau tips kepada 10 pengguna lain.',
          'Gunakan fitur Advance Dashboard.',
          'Unlocked Feature : Advanced Analytics, FAQ.'
        ]
      },
      {
        level: 5,
        title: 'Level 5: Master',
        tasks: [
          'Login dan Interaksi konsisten selama 30 hari.',
          'Capai skor kepuasan pengguna diatas 10%.',
          'Unlocked Feature : Custom Reward Store, Voucher/Gift.'
        ]
      }
    ];

    // Inisialisasi data untuk semua topics
    this.allTopics = [
      { topic: 'Info Pajak Bumi & Bangunan', count: 312, color: 'nat-1' },
      { topic: 'Cara Pembayaran Pajak Online', count: 289, color: 'nat-2' },
      { topic: 'Jatuh Tempo Pajak Restoran', count: 254, color: 'nat-3' },
      { topic: 'Denda Keterlambatan Pembayaran Pajak', count: 198, color: 'nat-1' },
      { topic: 'Prosedur Pendaftaran Objek Pajak Baru', count: 175, color: 'nat-2' },
      { topic: 'Informasi Pajak Reklame', count: 152, color: 'nat-3' },
      { topic: 'Cara Mengajukan Keringanan Pajak', count: 143, color: 'nat-1' },
      { topic: 'Simulasi Perhitungan Pajak Kendaraan', count: 128, color: 'nat-2' },
      { topic: 'Pajak Hotel dan Hiburan', count: 115, color: 'nat-3' },
      { topic: 'Pembayaran Pajak Melalui Bank', count: 102, color: 'nat-1' },
      { topic: 'Status Tunggakan Pajak', count: 89, color: 'nat-2' },
      { topic: 'Perubahan Data Objek Pajak', count: 76, color: 'nat-3' },
      { topic: 'Surat Keterangan Lunas Pajak', count: 63, color: 'nat-1' },
      { topic: 'Pajak Air Tanah', count: 51, color: 'nat-2' },
      { topic: 'Konsultasi Perpajakan Online', count: 42, color: 'nat-3' }
    ];
    this.filteredTopics = [...this.allTopics];
  }

  getStepIcon(level: number): string {
    if (level < this.selectedLevel) {
      return 'pi pi-check';
    }
    switch(level) {
      case 1: return 'pi pi-flag';
      case 2: return 'pi pi-star-half';
      case 3: return 'pi pi-star';
      case 4: return 'pi pi-sparkles';
      case 5: return 'pi pi-crown';
      default: return 'pi pi-circle';
    }
  }

  // Method untuk membuka modal Top Topics
  openTopTopicsModal(): void {
    this.displayTopTopicsModal = true;
    this.topicSearchValue = '';
    this.filteredTopics = [...this.allTopics];
  }

  // Method untuk menutup modal
  closeTopTopicsModal(): void {
    this.displayTopTopicsModal = false;
  }

  // Method untuk search topics
  onTopicSearch(): void {
    if (!this.topicSearchValue.trim()) {
      this.filteredTopics = [...this.allTopics];
      return;
    }
    
    const searchTerm = this.topicSearchValue.toLowerCase();
    this.filteredTopics = this.allTopics.filter(topic =>
      topic.topic.toLowerCase().includes(searchTerm)
    );
  }

  // Method untuk mendapatkan top 3 topics saja
  getTopThreeTopics(): any[] {
    return this.allTopics.slice(0, 3);
  }

  ngOnInit(): void {
    // --- Inisialisasi Chart Data ---
    this.platformAccessData = {
      labels: ['Telegram', 'Web', 'WhatsApp'],
      datasets: [
        {
          data: [55, 62, 25],
          backgroundColor: ['#3b82f6', '#fbbf24', '#10b981'],
          borderWidth: 0,
          hoverBorderWidth: 0
        }
      ]
    };
    
    this.taxRevenueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      datasets: [
        {
          label: 'Tren Penerimaan Pajak',
          data: [120, 150, 140, 180, 170, 210, 220, 235, 250, null, null, null],
          borderColor: '#009ef7',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: '#009ef7',
          pointBorderColor: '#009ef7'
        },
        {
          label: 'Prediksi Penerimaan Pajak Oleh AI',
          data: [130, 145, 155, 170, 190, 200, 230, 240, 260, 275, 285, 300],
          borderColor: '#50cd89',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
          pointBackgroundColor: '#50cd89',
          pointBorderColor: '#50cd89'
        }
      ]
    };

    // Options untuk Line Chart (Tax Revenue)
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#495057',
            usePointStyle: true,
            padding: 15
          }
        }
      },
      scales: {
        y: {
          ticks: { 
            color: '#495057',
            font: {
              size: 12
            }
          },
          grid: { 
            color: '#ebedef',
            lineWidth: 1
          }
        },
        x: {
          ticks: { 
            color: '#495057',
            font: {
              size: 12
            }
          },
          grid: { 
            color: '#ebedef',
            lineWidth: 1
          }
        }
      }
    };

    // Options khusus untuk Platform Access Chart (Doughnut)
    this.platformAccessChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            },
            color: '#495057'
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff'
        }
      },
      elements: {
        arc: {
          borderWidth: 0,
          borderColor: 'transparent'
        }
      },
      cutout: '60%',
      layout: {
        padding: 10
      }
    };
  }
}