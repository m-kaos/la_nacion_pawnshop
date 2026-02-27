import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, NotificationService } from '@vendure/admin-ui/core';
import { gql } from 'graphql-tag';

const GET_COMBO = gql`
  query GetCombo($id: Int!) {
    combo(id: $id) {
      id
      nombre
      productIds
      precioAntes
      precioAhora
      visible
    }
  }
`;

const GET_ARTICULOS = gql`
  query GetArticulosParaCombo {
    products(options: { take: 500, sort: { updatedAt: DESC } }) {
      items {
        id
        name
        customFields {
          marca
          modelo
          estadoArticulo
        }
        variants {
          price
        }
      }
    }
  }
`;

const CREATE_COMBO = gql`
  mutation CreateCombo($input: CreateComboInput!) {
    createCombo(input: $input) { id }
  }
`;

const UPDATE_COMBO = gql`
  mutation UpdateCombo($id: Int!, $input: UpdateComboInput!) {
    updateCombo(id: $id, input: $input) { id }
  }
`;

const DELETE_COMBO = gql`
  mutation DeleteCombo($id: Int!) {
    deleteCombo(id: $id)
  }
`;

@Component({
  standalone: false,
  selector: 'combo-detail',
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 24px;
    }
    .form-grid .full-width { grid-column: 1 / -1; }
    .section-title {
      grid-column: 1 / -1;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #999;
      letter-spacing: 0.05em;
      margin: 16px 0 4px;
      padding-bottom: 6px;
      border-bottom: 1px solid #eee;
    }
    .articulo-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .articulo-row:last-child { border-bottom: none; }
    .articulo-check { flex-shrink: 0; }
    .articulo-info { flex: 1; }
    .articulo-name { font-weight: 600; font-size: 14px; }
    .articulo-meta { font-size: 12px; color: #666; }
    .articulo-precio { font-size: 13px; color: #1a73b8; font-weight: 600; white-space: nowrap; }
    .selected-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #e8f0fe;
      color: #1a73b8;
      border-radius: 12px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      margin: 4px;
    }
    .selected-chip button {
      background: none;
      border: none;
      cursor: pointer;
      color: #1a73b8;
      font-size: 14px;
      line-height: 1;
      padding: 0;
    }
    .articulo-search {
      width: 100%;
      padding: 6px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 10px;
      box-sizing: border-box;
    }
    .articulo-picker {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 0 8px;
    }
    .no-results { color: #999; font-size: 13px; padding: 16px; text-align: center; }
  `],
  template: `
    <vdr-page-header>
      <vdr-page-title>{{ isNew ? 'Nuevo Combo' : 'Combo #' + id }}</vdr-page-title>
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
          <button class="btn btn-primary" (click)="save()" [disabled]="form?.invalid || saving">
            {{ saving ? 'Guardando…' : 'Guardar' }}
          </button>
        </vdr-ab-right>
      </vdr-action-bar>

      <vdr-card *ngIf="form" [formGroup]="form">
        <div class="form-grid">

          <div class="section-title">Información del Combo</div>

          <vdr-form-field label="Nombre del Combo" for="nombre" class="full-width">
            <input type="text" id="nombre" formControlName="nombre" class="clr-input"
              placeholder="Ej: Pack Electrónica, Combo Joyería Premium" />
          </vdr-form-field>

          <vdr-form-field label="Precio Antes (MXN)" for="precioAntes">
            <input type="number" id="precioAntes" formControlName="precioAntes" class="clr-input"
              placeholder="0" step="1" min="0" />
            <small style="color:#666">Precio original (se muestra tachado)</small>
          </vdr-form-field>

          <vdr-form-field label="Precio Ahora (MXN)" for="precioAhora">
            <input type="number" id="precioAhora" formControlName="precioAhora" class="clr-input"
              placeholder="0" step="1" min="0" />
            <small style="color:#1a73b8">Precio de oferta del combo</small>
          </vdr-form-field>

          <vdr-form-field label="Visibilidad" for="visible" class="full-width">
            <select id="visible" formControlName="visible" class="clr-select">
              <option [ngValue]="true">Visible — aparece en la tienda</option>
              <option [ngValue]="false">Oculto — no aparece en la tienda</option>
            </select>
          </vdr-form-field>

          <div class="section-title">Artículos del Combo</div>

          <!-- Selected chips -->
          <div class="full-width" style="margin-bottom: 12px; min-height: 36px;">
            <span *ngIf="selectedIds.length === 0" style="color:#999;font-size:13px;">
              Ningún artículo seleccionado. Búscalos abajo.
            </span>
            <span *ngFor="let id of selectedIds" class="selected-chip">
              {{ getArticuloNombre(id) }}
              <button type="button" (click)="removeArticulo(id)" title="Quitar">✕</button>
            </span>
          </div>

          <!-- Search + picker -->
          <div class="full-width">
            <input
              type="text"
              class="articulo-search"
              placeholder="Buscar artículo por nombre, marca o modelo…"
              [(ngModel)]="searchTerm"
              [ngModelOptions]="{standalone: true}"
            />
            <div class="articulo-picker">
              <ng-container *ngIf="filteredArticulos.length > 0; else sinResultados">
                <div *ngFor="let a of filteredArticulos" class="articulo-row">
                  <input
                    type="checkbox"
                    class="articulo-check"
                    [checked]="isSelected(a.id)"
                    (change)="toggleArticulo(a.id)"
                  />
                  <div class="articulo-info">
                    <div class="articulo-name">{{ a.name }}</div>
                    <div class="articulo-meta">
                      {{ a.customFields?.marca }} {{ a.customFields?.modelo }}
                      <span *ngIf="a.customFields?.estadoArticulo"
                        style="margin-left:8px;background:#f0f0f0;border-radius:8px;padding:1px 7px;">
                        {{ a.customFields?.estadoArticulo }}
                      </span>
                    </div>
                  </div>
                  <div class="articulo-precio">
                    \${{ ((a.variants[0]?.price || 0) / 100) | number:'1.2-2' }}
                  </div>
                </div>
              </ng-container>
              <ng-template #sinResultados>
                <div class="no-results">Sin artículos que coincidan</div>
              </ng-template>
            </div>
          </div>

        </div>
      </vdr-card>
    </vdr-page-body>
  `,
})
export class ComboDetailComponent implements OnInit {
  id: number | null = null;
  isNew = true;
  saving = false;
  form!: FormGroup;

  articulos: any[] = [];
  selectedIds: number[] = [];
  searchTerm = '';

  get filteredArticulos(): any[] {
    const q = this.searchTerm.toLowerCase().trim();
    if (!q) return this.articulos;
    return this.articulos.filter(a => {
      const text = `${a.name} ${a.customFields?.marca || ''} ${a.customFields?.modelo || ''}`.toLowerCase();
      return text.includes(q);
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [null, Validators.required],
      precioAntes: [0, Validators.required],
      precioAhora: [0, Validators.required],
      visible: [true, Validators.required],
    });

    // Load all articles for the picker
    this.dataService.query(GET_ARTICULOS).single$.subscribe((result: any) => {
      this.articulos = result.products?.items ?? [];
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = parseInt(idParam, 10);
      this.isNew = false;
      this.dataService.query(GET_COMBO, { id: this.id }).single$.subscribe((result: any) => {
        const c = result.combo;
        if (c) {
          this.selectedIds = (c.productIds || []).map((x: any) => Number(x));
          this.form.patchValue({
            nombre: c.nombre,
            precioAntes: c.precioAntes,
            precioAhora: c.precioAhora,
            visible: c.visible,
          });
        }
      });
    }
  }

  isSelected(productId: string | number): boolean {
    return this.selectedIds.includes(Number(productId));
  }

  toggleArticulo(productId: string | number) {
    const id = Number(productId);
    if (this.isSelected(id)) {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    } else {
      this.selectedIds = [...this.selectedIds, id];
    }
  }

  removeArticulo(productId: number) {
    this.selectedIds = this.selectedIds.filter(x => x !== productId);
  }

  getArticuloNombre(productId: number): string {
    const a = this.articulos.find(x => Number(x.id) === productId);
    return a ? a.name : `#${productId}`;
  }

  save() {
    if (!this.form || this.form.invalid) return;
    this.saving = true;
    const raw = this.form.value;

    const input = {
      nombre: raw.nombre,
      productIds: this.selectedIds,
      precioAntes: Math.round(+raw.precioAntes || 0),
      precioAhora: Math.round(+raw.precioAhora || 0),
      visible: raw.visible,
    };

    if (this.isNew) {
      this.dataService.mutate(CREATE_COMBO, { input }).subscribe(() => {
        this.saving = false;
        this.notificationService.success('Combo creado');
        this.router.navigate(['../'], { relativeTo: this.route });
      }, () => { this.saving = false; });
    } else {
      this.dataService.mutate(UPDATE_COMBO, { id: this.id, input }).subscribe(() => {
        this.saving = false;
        this.notificationService.success('Combo actualizado');
      }, () => { this.saving = false; });
    }
  }

  delete() {
    if (!this.id) return;
    if (!confirm('¿Eliminar este combo? Esta acción no se puede deshacer.')) return;
    this.dataService.mutate(DELETE_COMBO, { id: this.id }).subscribe(() => {
      this.notificationService.success('Combo eliminado');
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
