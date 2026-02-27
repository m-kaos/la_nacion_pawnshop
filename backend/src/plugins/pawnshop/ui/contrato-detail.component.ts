import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, NotificationService } from '@vendure/admin-ui/core';
import { gql } from 'graphql-tag';

const GET_CONTRATO = gql`
  query GetContrato($id: Int!) {
    contrato(id: $id) {
      id customerId productId estado
      montoPrestamo montoTotal fechaContrato fechaVencimiento plazo tasaInteres
    }
  }
`;

const CREATE_CONTRATO = gql`
  mutation CreateContrato($input: CreateContratoInput!) {
    createContrato(input: $input) { id }
  }
`;

const UPDATE_CONTRATO = gql`
  mutation UpdateContrato($id: Int!, $input: UpdateContratoInput!) {
    updateContrato(id: $id, input: $input) { id }
  }
`;

const DELETE_CONTRATO = gql`
  mutation DeleteContrato($id: Int!) {
    deleteContrato(id: $id)
  }
`;

@Component({
  standalone: false,
  selector: 'contrato-detail',
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 24px;
    }
    .form-grid .full-width { grid-column: 1 / -1; }
    .id-field { display: flex; align-items: center; gap: 8px; }
    .id-field input { width: 120px; flex-shrink: 0; }
  `],
  template: `
    <vdr-page-header>
      <vdr-page-title>{{ isNew ? 'Nuevo Contrato' : 'Contrato #' + id }}</vdr-page-title>
    </vdr-page-header>
    <vdr-page-body>
      <vdr-action-bar>
        <vdr-ab-left>
          <button class="btn btn-danger-outline" *ngIf="!isNew" (click)="delete()">
            Eliminar
          </button>
        </vdr-ab-left>
        <vdr-ab-right>
          <a class="btn btn-secondary" [routerLink]="['../']">Cancelar</a>
          <button class="btn btn-primary" (click)="save()" [disabled]="form?.invalid">
            Guardar
          </button>
        </vdr-ab-right>
      </vdr-action-bar>

      <vdr-card *ngIf="form" [formGroup]="form">
        <div class="form-grid">

          <vdr-form-field label="Cliente ID" for="customerId">
            <div class="id-field">
              <input type="number" id="customerId" formControlName="customerId" class="clr-input" />
              <a *ngIf="form.value.customerId"
                 [routerLink]="['/customer/customers', form.value.customerId]"
                 class="btn btn-sm btn-secondary">
                Ver cliente →
              </a>
            </div>
          </vdr-form-field>

          <vdr-form-field label="Producto ID" for="productId">
            <div class="id-field">
              <input type="number" id="productId" formControlName="productId" class="clr-input" />
              <a *ngIf="form.value.productId"
                 [routerLink]="['/catalog/products', form.value.productId]"
                 class="btn btn-sm btn-secondary">
                Ver producto →
              </a>
            </div>
          </vdr-form-field>

          <vdr-form-field label="Fecha de Contrato" for="fechaContrato">
            <input type="date" id="fechaContrato" formControlName="fechaContrato" class="clr-input" />
          </vdr-form-field>

          <vdr-form-field label="Fecha de Vencimiento" for="fechaVencimiento">
            <input type="date" id="fechaVencimiento" formControlName="fechaVencimiento" class="clr-input" />
          </vdr-form-field>

          <vdr-form-field label="Plazo (meses)" for="plazo">
            <input type="number" id="plazo" formControlName="plazo" class="clr-input" />
          </vdr-form-field>

          <vdr-form-field label="Tasa de Interés mensual (%)" for="tasaInteres">
            <input type="number" step="0.01" id="tasaInteres" formControlName="tasaInteres" class="clr-input" />
          </vdr-form-field>

          <vdr-form-field label="Monto Préstamo (MXN)" for="montoPrestamo">
            <input type="number" id="montoPrestamo" formControlName="montoPrestamo" class="clr-input" step="0.01" min="0" />
          </vdr-form-field>

          <vdr-form-field label="Monto Total con intereses (MXN)" for="montoTotal">
            <input type="number" id="montoTotal" formControlName="montoTotal" class="clr-input" step="0.01" min="0" />
          </vdr-form-field>

          <vdr-form-field label="Estado" for="estado">
            <select id="estado" formControlName="estado" class="clr-select">
              <option value="Activo">Activo</option>
              <option value="Liquidado">Liquidado</option>
              <option value="Vencido">Vencido</option>
            </select>
          </vdr-form-field>

        </div>
      </vdr-card>
    </vdr-page-body>
  `,
})
export class ContratoDetailComponent implements OnInit {
  id: number | null = null;
  isNew = true;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      customerId: [null, Validators.required],
      productId: [null, Validators.required],
      fechaContrato: [null, Validators.required],
      plazo: [null, Validators.required],
      tasaInteres: [null, Validators.required],
      montoPrestamo: [null, Validators.required],
      montoTotal: [null, Validators.required],
      fechaVencimiento: [null, Validators.required],
      estado: ['Activo', Validators.required],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.isNew = false;
      this.dataService.query(GET_CONTRATO, { id: this.id }).single$.subscribe((result: any) => {
        const c = result.contrato;
        if (c) {
          this.form.patchValue({
            ...c,
            fechaContrato: c.fechaContrato?.substring(0, 10),
            fechaVencimiento: c.fechaVencimiento?.substring(0, 10),
          });
        }
      });
    }
  }

  save() {
    if (!this.form || this.form.invalid) return;
    const raw = this.form.value;
    const input = {
      ...raw,
      customerId: +raw.customerId,
      productId: +raw.productId,
      plazo: +raw.plazo,
      tasaInteres: +raw.tasaInteres,
      montoPrestamo: Math.round(+raw.montoPrestamo),
      montoTotal: Math.round(+raw.montoTotal),
    };
    if (this.isNew) {
      this.dataService.mutate(CREATE_CONTRATO, { input }).subscribe(() => {
        this.notificationService.success('Contrato creado');
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    } else {
      this.dataService.mutate(UPDATE_CONTRATO, { id: this.id, input }).subscribe(() => {
        this.notificationService.success('Contrato actualizado');
      });
    }
  }

  delete() {
    if (!this.id) return;
    if (!confirm('¿Eliminar este contrato?')) return;
    this.dataService.mutate(DELETE_CONTRATO, { id: this.id }).subscribe(() => {
      this.notificationService.success('Contrato eliminado');
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
