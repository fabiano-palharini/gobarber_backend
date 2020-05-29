# Password recovery

**Functional Requirements**
 - User must be able to recover its password through his/her e-mail;
 - User must be able to receive an email containing the instructions to recover his/her email;
 - User must be abçe to reset his/her password;

**Non-Functional Requirements**
 - Mailtrap must be used to test email service;
 - E-mail service must run in background;

**Business Rules**
 - The reset link sent by-email must expire within 2 hours;
 - The user must confirm the new password when reseting his/her password;




# Profile update

**Functional Requirements**
 - User must be able to update user, name and password;

**Non-Functional Requirements**
 -

**Business Rules**
 - User must not be able to change his/her e-mail to an existing e-mail;
 - In order to update the password, the user must be able to provide the previous e-mail;
 - In order to update the password, the user must be able to confirm the new password;




# Scheduling

**Functional Requirements**
 - User must be able to list all service providers;
 - User must be able to see all available days with available schedule;
 - User must be able to see all available schedules for a specific day for a specific service provider;
 - User must be able to book an appointment with a service provider;

**Non-Functional Requirements**
 - The service providers list must be stored in cache;

**Business Rules**
 - Each appointment must last "X" minutes/hours;
 - The available agenda is between "A" and "B" (e.g.: 8AM and 18PM);
 - User must not be able to book an appointment in an unavailable time;
 - User must not be able to book for a time in the past;




 # Service provider

**Functional Requirements**
 - The service provider must be able to list his/her appointments to a specific day;
 - The service provider must be able to receive an e-mail every time a new appointment is booked;
 - The service provider must be able to see the unread notifications;

**Non-Functional Requirements**
 - Today's service provider's appointments must be stored in cache;
 - Appointments' notifications must be stored in MongoDB;
 - Service provider's notifications must be sent in real-time using Socket.io;

**Business Rules**
 - The notification must have a status of read/unread;
