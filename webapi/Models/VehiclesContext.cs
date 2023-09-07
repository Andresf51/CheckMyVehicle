using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace webapi.Models;

public partial class VehiclesContext : DbContext
{
    public VehiclesContext()
    {
    }

    public VehiclesContext(DbContextOptions<VehiclesContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Registro> Registros { get; set; }

    public virtual DbSet<Revisione> Revisiones { get; set; }

    public virtual DbSet<Vehiclesdatum> Vehiclesdata { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_spanish_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Registro>(entity =>
        {
            entity.HasKey(e => e.RegistroId).HasName("PRIMARY");

            entity.ToTable("registro");

            entity.HasIndex(e => e.RevisionId, "RevisionId").IsUnique();

            entity.Property(e => e.Apellido)
                .HasMaxLength(70)
                .IsFixedLength();
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsFixedLength();
        });

        modelBuilder.Entity<Revisione>(entity =>
        {
            entity.HasKey(e => e.RevisionId).HasName("PRIMARY");

            entity.ToTable("revisiones");

            entity.Property(e => e.FechaHora).HasColumnType("datetime");
        });

        modelBuilder.Entity<Vehiclesdatum>(entity =>
        {
            entity.HasKey(e => e.VehicleId).HasName("PRIMARY");

            entity.ToTable("vehiclesdata");

            entity.Property(e => e.Linea)
                .HasMaxLength(50)
                .IsFixedLength();
            entity.Property(e => e.Marca)
                .HasMaxLength(50)
                .IsFixedLength();
            entity.Property(e => e.Placa)
                .HasMaxLength(6)
                .IsFixedLength();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
