drop database if exists `medical-appointment`;
create database `medical-appointment`;

-- Drop the `user` table if it already exists
drop table if exists `medical-appointment`.`user`;
create table `medical-appointment`.`user` (
	`id` int not null auto_increment,
    `username` varchar(50) not null unique, 
    `email` varchar(100) not null unique,
    `password` char(90) not null,
    `first_name` varchar(100) not null,
    `middle_name` varchar(100),
    `last_name` varchar(100) not null,
    `phone_no` varchar(15) not null unique,
    `gender` enum('M', 'F', 'O') not null,
    `dob` date not null,
    `age` tinyint not null,
    `address` text,
    `role` enum('A', 'D', 'P') not null,
    `registered_at` timestamp default current_timestamp,
    `updated_at` timestamp default current_timestamp on update current_timestamp,
    constraint pk_user primary key (`id`)
) engine = InnoDB;

drop table if exists `medical-appointment`.`specialization`;
create table `medical-appointment`.`specialization` (
	`id` int not null auto_increment,
    `name` varchar(100) not null unique,
    `description` text not null,
    primary key (`id`)
) engine = InnoDB;

drop table if exists `medical-appointment`.`doctor`;
create table `medical-appointment`.`doctor` (
	`id` int not null auto_increment,
    `user_id` int not null unique,
    `specialization_id` int,
    `license_no` varchar(50) not null,
    `years_of_experience` tinyint,
    `is_generalist` boolean,
    `is_specialist` boolean,
    `is_approved` boolean,
    constraint pk_doctor primary key (`id`),
    constraint fk_doctor_user  foreign key (`user_id`) references `medical-appointment`.`user`(`id`),
    constraint fk_doctor_specialization foreign key (`specialization_id`) references `medical-appointment`.`specialization`(`id`)
) engine = InnoDB;

drop table if exists `medical-appointment`.`patient`;
create table `medical-appointment`.`patient` (
	`id` int not null auto_increment,
    `user_id` int not null unique,
    `blood_group` enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') not null,
    constraint pk_patient primary key (`id`),
    constraint fk_patient_user foreign key (`user_id`) references `medical-appointment`.`user`(`id`)
) engine = InnoDB;

drop table if exists `medical-appointment`.`admin`;
create table `medical-appointment`.`admin` (
	`id` int not null auto_increment,
    `user_id` int not null unique,
    constraint pk_admin primary key (`id`),
    constraint fk_admin_user foreign key (`user_id`) references `medical-appointment`.`user`(`id`)
) engine = InnoDB;

drop table if exists `medical-appointment`.`appointment`;
create table `medical-appointment`.`appointment` (
	`id` int not null auto_increment,
    `doctor_id` int not null,
    `patient_id` int not null,
    `date_time` datetime not null,
    `duration` mediumint not null,
    `status` enum('SCHEDULED', 'COMPLETED', 'CANCELLED') not null,
    constraint pk_appointment primary key (`id`),
    constraint fk_appointment_doctor foreign key (`doctor_id`) references `medical-appointment`.`doctor`(`id`),
    constraint fk_appointment_patient foreign key (`patient_id`) references `medical-appointment`.`patient` (`id`)
) engine = InnoDB;

