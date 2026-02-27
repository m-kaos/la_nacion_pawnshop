import { Component, OnInit } from '@angular/core';
import { DataService } from '@vendure/admin-ui/core';
import { gql } from 'graphql-tag';

const GET_ARTICULOS = gql`
  query GetArticulos {
    products(options: { take: 500, sort: { updatedAt: DESC } }) {
      items {
        id
        name
        enabled
        variants {
          id
          sku
          price
        }
        customFields {
          marca
          modelo
          numeroDeSerie
          estadoArticulo
          valorAvaluo
          familia
          fechaEntrada
        }
      }
      totalItems
    }
  }
`;

@Component({
  standalone: false,
  selector: 'articulos-list',
  styles: [`
    .estado-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .estado-disponible { background: #e3f0fb; color: #1a73b8; }
    .estado-empenado   { background: #fff3cd; color: #856404; }
    .estado-vendido    { background: #e6f4ea; color: #1e7e34; }
    .estado-retirado   { background: #f0f0f0; color: #666; }
    .search-input {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 13px;
      width: 300px;
      height: 30px;
      outline: none;
    }
    .search-input:focus { border-color: #1a73b8; }
    th.sortable { cursor: pointer; user-select: none; white-space: nowrap; }
    th.sortable:hover { background: #f5f5f5; }
    .sort-icon { font-size: 10px; margin-left: 3px; opacity: 0.5; }
    .sort-icon.active { opacity: 1; color: #1a73b8; }
    .dias-badge { font-weight: 600; }
    .dias-alert { color: #dc3545; }
    .dias-warn  { color: #856404; }
    .dias-ok    { color: #1e7e34; }
  `],
  template: `
    <vdr-page-header>
      <vdr-page-title>Artículos en Inventario</vdr-page-title>
    </vdr-page-header>
    <vdr-page-body>
      <vdr-action-bar>
        <vdr-ab-left>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar por nombre, marca, modelo, SKU..."
            [(ngModel)]="searchTerm"
          />
        </vdr-ab-left>
        <vdr-ab-right>
          <a class="btn btn-primary" [routerLink]="['./new']">
            <clr-icon shape="plus"></clr-icon>
            Nuevo Artículo
          </a>
        </vdr-ab-right>
      </vdr-action-bar>

      <vdr-card>
        <table class="table">
          <thead>
            <tr>
              <th class="sortable" (click)="sortBy('id')">
                ID <span class="sort-icon" [class.active]="sortField==='id'">{{ sortField==='id' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('nombre')">
                Nombre <span class="sort-icon" [class.active]="sortField==='nombre'">{{ sortField==='nombre' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('marca')">
                Marca / Modelo <span class="sort-icon" [class.active]="sortField==='marca'">{{ sortField==='marca' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('familia')">
                Familia <span class="sort-icon" [class.active]="sortField==='familia'">{{ sortField==='familia' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('serie')">
                No. Serie <span class="sort-icon" [class.active]="sortField==='serie'">{{ sortField==='serie' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('estado')">
                Estado <span class="sort-icon" [class.active]="sortField==='estado'">{{ sortField==='estado' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('avaluo')">
                Avalúo <span class="sort-icon" [class.active]="sortField==='avaluo'">{{ sortField==='avaluo' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('precio')">
                Precio <span class="sort-icon" [class.active]="sortField==='precio'">{{ sortField==='precio' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('sku')">
                SKU <span class="sort-icon" [class.active]="sortField==='sku'">{{ sortField==='sku' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('fechaEntrada')">
                F. Entrada <span class="sort-icon" [class.active]="sortField==='fechaEntrada'">{{ sortField==='fechaEntrada' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th class="sortable" (click)="sortBy('dias')">
                No. Días <span class="sort-icon" [class.active]="sortField==='dias'">{{ sortField==='dias' ? (sortDir==='asc' ? '▲' : '▼') : '⇅' }}</span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of displayedArticulos">
              <td>{{ a.id }}</td>
              <td>{{ a.name }}</td>
              <td>{{ a.customFields?.marca }} {{ a.customFields?.modelo }}</td>
              <td>{{ a.customFields?.familia || '—' }}</td>
              <td>{{ a.customFields?.numeroDeSerie || '—' }}</td>
              <td>
                <span class="estado-badge"
                  [class.estado-disponible]="a.customFields?.estadoArticulo === 'Disponible'"
                  [class.estado-empenado]="a.customFields?.estadoArticulo === 'Empeñado'"
                  [class.estado-vendido]="a.customFields?.estadoArticulo === 'Vendido'"
                  [class.estado-retirado]="a.customFields?.estadoArticulo === 'Retirado'">
                  {{ a.customFields?.estadoArticulo || '—' }}
                </span>
              </td>
              <td>\${{ (a.customFields?.valorAvaluo || 0) | number:'1.2-2' }}</td>
              <td>\${{ ((a.variants[0]?.price || 0) / 100) | number:'1.2-2' }}</td>
              <td>{{ a.variants[0]?.sku || '—' }}</td>
              <td>{{ formatFecha(a.customFields?.fechaEntrada) }}</td>
              <td>
                <span class="dias-badge"
                  [class.dias-alert]="getDias(a.customFields?.fechaEntrada) > 365"
                  [class.dias-warn]="getDias(a.customFields?.fechaEntrada) > 180 && getDias(a.customFields?.fechaEntrada) <= 365"
                  [class.dias-ok]="getDias(a.customFields?.fechaEntrada) > 0 && getDias(a.customFields?.fechaEntrada) <= 180">
                  {{ a.customFields?.fechaEntrada ? getDias(a.customFields?.fechaEntrada) : '—' }}
                </span>
              </td>
              <td style="text-align:right;">
                <a [routerLink]="['./', a.id]" class="btn btn-sm btn-secondary">
                  Editar →
                </a>
              </td>
            </tr>
            <tr *ngIf="displayedArticulos.length === 0">
              <td colspan="12" style="text-align:center; padding: 24px; color: #666;">
                {{ searchTerm ? 'Sin resultados para "' + searchTerm + '"' : 'No hay artículos registrados' }}
              </td>
            </tr>
          </tbody>
        </table>
        <div style="padding: 8px 0; color: #666; font-size: 12px;">
          {{ displayedArticulos.length }} de {{ total }} artículos
        </div>
      </vdr-card>
    </vdr-page-body>
  `,
})
export class ArticulosListComponent implements OnInit {
  articulos: any[] = [];
  total = 0;
  searchTerm = '';
  sortField = 'fechaEntrada';
  sortDir: 'asc' | 'desc' = 'desc';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.query(GET_ARTICULOS).stream$.subscribe((result: any) => {
      this.articulos = result.products?.items ?? [];
      this.total = result.products?.totalItems ?? 0;
    });
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
  }

  getDias(fechaEntrada: string | null | undefined): number {
    if (!fechaEntrada) return 0;
    return Math.floor((Date.now() - new Date(fechaEntrada).getTime()) / 86400000);
  }

  formatFecha(fechaEntrada: string | null | undefined): string {
    if (!fechaEntrada) return '—';
    const d = new Date(fechaEntrada);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  get displayedArticulos(): any[] {
    const term = this.searchTerm.trim().toLowerCase();

    let list = term
      ? this.articulos.filter(a => {
          const sku = a.variants?.[0]?.sku ?? '';
          return (
            a.name?.toLowerCase().includes(term) ||
            a.customFields?.marca?.toLowerCase().includes(term) ||
            a.customFields?.modelo?.toLowerCase().includes(term) ||
            a.customFields?.numeroDeSerie?.toLowerCase().includes(term) ||
            a.customFields?.familia?.toLowerCase().includes(term) ||
            sku.toLowerCase().includes(term)
          );
        })
      : [...this.articulos];

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let av: any, bv: any;
      switch (this.sortField) {
        case 'nombre':       av = a.name;                                       bv = b.name;                                       break;
        case 'marca':        av = a.customFields?.marca;                        bv = b.customFields?.marca;                        break;
        case 'familia':      av = a.customFields?.familia;                      bv = b.customFields?.familia;                      break;
        case 'serie':        av = a.customFields?.numeroDeSerie;                bv = b.customFields?.numeroDeSerie;                break;
        case 'estado':       av = a.customFields?.estadoArticulo;               bv = b.customFields?.estadoArticulo;               break;
        case 'avaluo':       av = a.customFields?.valorAvaluo ?? 0;             bv = b.customFields?.valorAvaluo ?? 0;             break;
        case 'precio':       av = a.variants?.[0]?.price ?? 0;                  bv = b.variants?.[0]?.price ?? 0;                  break;
        case 'sku':          av = a.variants?.[0]?.sku;                         bv = b.variants?.[0]?.sku;                         break;
        case 'fechaEntrada': av = a.customFields?.fechaEntrada ?? '';           bv = b.customFields?.fechaEntrada ?? '';           break;
        case 'dias':         av = this.getDias(a.customFields?.fechaEntrada);   bv = this.getDias(b.customFields?.fechaEntrada);   break;
        default:             av = +a.id;                                        bv = +b.id;
      }
      if (av === bv) return 0;
      if (av == null || av === '') return 1;
      if (bv == null || bv === '') return -1;
      return av < bv ? -dir : dir;
    });

    return list;
  }
}
