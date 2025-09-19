import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  // User profile data
  userProfile = {
    fullName: 'Kota Kediri',
    email: 'admin@kotakediri.go.id',
    role: 'Administrator',
    phone: '081234567890',
    avatar: '/assets/images/logo_kota_kediri.png'
  };

  // Activity log data
  activityLogs = [
    {
      action: 'Mengubah kata sandi',
      details: 'IP: 192.168.1.1',
      time: '1 jam lalu'
    },
    {
      action: 'Login berhasil',
      details: 'IP: 192.168.1.1',
      time: '3 jam lalu'
    },
    {
      action: 'Update AI Knowledge',
      details: 'perda_pajak_2024.pdf',
      time: '1 hari lalu'
    },
    {
      action: 'Update AI Knowledge',
      details: 'basic_knowledge.pdf',
      time: '1 bulan lalu'
    },
    {
      action: 'Update AI Knowledge',
      details: 'pajak_kendaraan_2024.pdf',
      time: '1 tahun lalu'
    }
  ];

  // Password form data
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  onProfilePhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.match(/image\/(jpg|jpeg|png|gif)/)) {
        alert('Hanya file JPG, GIF, atau PNG yang diperbolehkan.');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB.');
        return;
      }

      // Create file reader to preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userProfile.avatar = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onProfileSubmit(): void {
    // Validate form data
    if (!this.userProfile.fullName.trim()) {
      alert('Nama lengkap harus diisi.');
      return;
    }

    if (!this.userProfile.phone.trim()) {
      alert('Nomor telepon harus diisi.');
      return;
    }

    // Here you would typically call a service to update the profile
    console.log('Profile updated:', this.userProfile);
    alert('Profil berhasil diperbarui!');
  }

  onPasswordSubmit(): void {
    // Validate password form
    if (!this.passwordForm.currentPassword) {
      alert('Kata sandi saat ini harus diisi.');
      return;
    }

    if (!this.passwordForm.newPassword) {
      alert('Kata sandi baru harus diisi.');
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      alert('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // Here you would typically call a service to update the password
    console.log('Password change requested');
    alert('Kata sandi berhasil diubah!');
    
    // Clear form
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  onLogout(): void {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      // Here you would typically call authentication service to logout
      console.log('User logged out');
      // Redirect to login page or handle logout logic
    }
  }

  // Navigation methods
  navigateTo(route: string): void {
    // Here you would use Angular Router to navigate
    console.log('Navigating to:', route);
  }
}