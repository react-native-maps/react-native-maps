# AGP 9 enables strictFullModeForKeepRules: Room's class-only rule no
# longer keeps this constructor. Retain it for WorkManager startup reflection.
-keep class * extends androidx.room.RoomDatabase { <init>(); }
-keep class * extends androidx.work.InputMerger { <init>(); }
