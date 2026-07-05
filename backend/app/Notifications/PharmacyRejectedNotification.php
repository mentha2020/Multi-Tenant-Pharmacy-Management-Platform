<?php

namespace App\Notifications;

use App\Models\Pharmacy;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PharmacyRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Pharmacy $pharmacy,
        public string $reason
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Pharmacy Registration Update')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('We regret to inform you that your pharmacy registration for "' . $this->pharmacy->name . '" has been declined.')
            ->line('Reason: ' . $this->reason)
            ->line('You may reapply with corrected information or contact our support team for assistance.')
            ->action('Contact Support', url('/support'))
            ->line('Thank you for your interest in joining our platform.');
    }
}
