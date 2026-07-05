<?php

namespace App\Notifications;

use App\Models\Pharmacy;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PharmacyApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Pharmacy $pharmacy
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Pharmacy Has Been Approved!')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Congratulations! Your pharmacy "' . $this->pharmacy->name . '" has been approved and is now active on our platform.')
            ->line('You can now login to your pharmacy dashboard and start managing your inventory.')
            ->line('Your pharmacy subdomain: ' . $this->pharmacy->subdomain . '.' . config('services.platform.domain'))
            ->action('Go to Dashboard', url('/pharmacy/dashboard'))
            ->line('If you have any questions, feel free to contact our support team.');
    }
}
