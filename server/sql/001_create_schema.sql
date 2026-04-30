IF OBJECT_ID(N'dbo.BookingSubmission', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.BookingSubmission
    (
        Id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT PK_BookingSubmission PRIMARY KEY,
        ReferenceNo NVARCHAR(32) NOT NULL,
        CreatedAt DATETIMEOFFSET(7) NOT NULL,
        Locale NVARCHAR(8) NOT NULL,
        ServiceId NVARCHAR(32) NOT NULL,
        ClinicId NVARCHAR(128) NOT NULL,
        AppointmentDate DATE NOT NULL,
        TimePreference NVARCHAR(32) NOT NULL,
        CustomerName NVARCHAR(200) NOT NULL,
        WhatsappPhone NVARCHAR(32) NOT NULL,
        AlternateClinicConsent BIT NOT NULL,
        NearestDateConsent BIT NOT NULL,
        CONSTRAINT UQ_BookingSubmission_ReferenceNo UNIQUE (ReferenceNo),
        CONSTRAINT CK_BookingSubmission_Locale
            CHECK (Locale IN (N'tc', N'sc', N'en')),
        CONSTRAINT CK_BookingSubmission_ServiceId
            CHECK (ServiceId IN (N'ecg', N'blood', N'combo')),
        CONSTRAINT CK_BookingSubmission_TimePreference
            CHECK (TimePreference IN (N'morning', N'afternoon', N'noPreference'))
    );
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_BookingSubmission_CreatedAt'
      AND object_id = OBJECT_ID(N'dbo.BookingSubmission', N'U')
)
BEGIN
    CREATE INDEX IX_BookingSubmission_CreatedAt
        ON dbo.BookingSubmission (CreatedAt DESC);
END;
GO
