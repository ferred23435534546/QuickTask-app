import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  category: string;
  imageUrl?: string;
  readTime?: string;
  tags?: string[];
}

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CategoryDetailComponent implements OnInit {
  categoryName: string = '';
  posts: BlogPost[] = [];
  expandedPost: BlogPost | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  expandPost(post: BlogPost): void {
    this.expandedPost = post;
  }

  closeExpandedPost(): void {
    this.expandedPost = null;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryName = this.capitalizeFirstLetter(params['category']);
      
      // Posts específicos según la categoría
      switch (params['category'].toLowerCase()) {
        case 'hogar':
          this.posts = [
            {
              id: '1',
              title: 'Consejos para mantener tu hogar organizado',
              content: 'Mantener un hogar organizado puede parecer una tarea abrumadora, pero con estos consejos prácticos podrás lograrlo fácilmente. Primero, establece una rutina diaria de limpieza que incluya tareas básicas como hacer la cama, lavar los platos y ordenar las áreas comunes. Segundo, implementa un sistema de organización para cada habitación, utilizando contenedores etiquetados y aprovechando el espacio vertical...',
              author: 'María García',
              date: new Date('2024-02-20'),
              category: this.categoryName,
              imageUrl: 'assets/images/home-organization.jpg',
              readTime: '5 minutos',
              tags: ['Organización', 'Limpieza', 'Consejos prácticos']
            },
            {
              id: '2',
              title: 'Las mejores herramientas para el mantenimiento del hogar',
              content: 'Tener las herramientas adecuadas es esencial para mantener tu hogar en buen estado. En esta guía, te presentamos una lista completa de las herramientas básicas que todo hogar debería tener, desde un juego de destornilladores de calidad hasta un taladro inalámbrico versátil. Además, te explicamos cómo elegir las mejores opciones según tu presupuesto y necesidades específicas...',
              author: 'Carlos Rodríguez',
              date: new Date('2024-02-21'),
              category: this.categoryName,
              imageUrl: 'assets/images/home-tools.jpg',
              readTime: '7 minutos',
              tags: ['Herramientas', 'Mantenimiento', 'Guía de compra']
            },
            {
              id: '3',
              title: 'Decoración sostenible: Cómo crear un hogar eco-friendly',
              content: 'La decoración sostenible no solo es beneficiosa para el medio ambiente, sino que también puede crear espacios únicos y llenos de personalidad. Descubre cómo incorporar materiales reciclados, plantas naturales y elementos de segunda mano para crear un ambiente acogedor y respetuoso con el planeta. Incluimos ideas creativas y consejos prácticos para cada habitación...',
              author: 'Ana Martínez',
              date: new Date('2024-02-22'),
              category: this.categoryName,
              imageUrl: 'assets/images/eco-friendly-decor.jpg',
              readTime: '6 minutos',
              tags: ['Decoración', 'Sostenibilidad', 'DIY']
            }
          ];
          break;

        case 'tecnologia':
          this.posts = [
            {
              id: '1',
              title: 'Guía completa para optimizar tu ordenador',
              content: 'Aprende a mantener tu ordenador funcionando de manera óptima con esta guía paso a paso. Desde la limpieza de archivos temporales hasta la actualización de controladores, cubrimos todos los aspectos esenciales para mejorar el rendimiento de tu equipo. También incluimos recomendaciones de software útil y consejos para prevenir problemas comunes...',
              author: 'Carlos Martínez',
              date: new Date('2024-02-23'),
              category: this.categoryName,
              imageUrl: 'assets/images/computer-optimization.jpg',
              readTime: '8 minutos',
              tags: ['Mantenimiento PC', 'Optimización', 'Software']
            },
            {
              id: '2',
              title: 'Seguridad digital: Protege tus dispositivos y datos',
              content: 'En la era digital, la seguridad de nuestros dispositivos y datos personales es crucial. Descubre las mejores prácticas para proteger tu información, desde la creación de contraseñas seguras hasta el uso de autenticación de dos factores. Además, analizamos las últimas amenazas cibernéticas y cómo prevenirlas...',
              author: 'Laura Sánchez',
              date: new Date('2024-02-24'),
              category: this.categoryName,
              imageUrl: 'assets/images/digital-security.jpg',
              readTime: '6 minutos',
              tags: ['Seguridad', 'Privacidad', 'Ciberseguridad']
            },
            {
              id: '3',
              title: 'Las mejores apps para aumentar tu productividad',
              content: 'Descubre una selección cuidadosa de aplicaciones que te ayudarán a mejorar tu productividad diaria. Desde gestores de tareas hasta herramientas de colaboración, analizamos las opciones más efectivas para diferentes necesidades y estilos de trabajo...',
              author: 'David López',
              date: new Date('2024-02-25'),
              category: this.categoryName,
              imageUrl: 'assets/images/productivity-apps.jpg',
              readTime: '5 minutos',
              tags: ['Apps', 'Productividad', 'Herramientas digitales']
            }
          ];
          break;

        case 'educacion':
          this.posts = [
            {
              id: '1',
              title: 'Técnicas de estudio efectivas para cualquier materia',
              content: 'Descubre métodos probados para mejorar tu capacidad de aprendizaje y retención de información. Desde la técnica Pomodoro hasta los mapas mentales, exploramos diferentes estrategias que puedes adaptar a tu estilo de aprendizaje personal...',
              author: 'Laura Sánchez',
              date: new Date('2024-02-26'),
              category: this.categoryName,
              imageUrl: 'assets/images/study-techniques.jpg',
              readTime: '7 minutos',
              tags: ['Técnicas de estudio', 'Aprendizaje', 'Educación']
            },
            {
              id: '2',
              title: 'Recursos educativos online gratuitos',
              content: 'Una guía completa de los mejores recursos educativos disponibles en internet de forma gratuita. Desde cursos completos hasta herramientas interactivas, te mostramos dónde encontrar material de calidad para continuar tu aprendizaje...',
              author: 'Miguel Torres',
              date: new Date('2024-02-27'),
              category: this.categoryName,
              imageUrl: 'assets/images/online-resources.jpg',
              readTime: '6 minutos',
              tags: ['Recursos online', 'Educación gratuita', 'E-learning']
            },
            {
              id: '3',
              title: 'Cómo prepararse para exámenes importantes',
              content: 'Estrategias prácticas para prepararte adecuadamente para cualquier tipo de examen. Incluye consejos sobre planificación del tiempo, técnicas de memorización y manejo del estrés durante el período de preparación...',
              author: 'Ana García',
              date: new Date('2024-02-28'),
              category: this.categoryName,
              imageUrl: 'assets/images/exam-prep.jpg',
              readTime: '8 minutos',
              tags: ['Exámenes', 'Preparación', 'Estudio']
            }
          ];
          break;

        case 'mudanzas':
          this.posts = [
            {
              id: '1',
              title: 'Planifica tu mudanza: Guía paso a paso',
              content: 'Una guía detallada para organizar tu mudanza de manera eficiente. Desde la creación de un calendario hasta la organización de cajas y documentos importantes, te ayudamos a hacer el proceso lo más sencillo posible...',
              author: 'Elena Ruiz',
              date: new Date('2024-02-29'),
              category: this.categoryName,
              imageUrl: 'assets/images/moving-guide.jpg',
              readTime: '9 minutos',
              tags: ['Planificación', 'Organización', 'Mudanza']
            },
            {
              id: '2',
              title: 'Consejos para embalar y proteger tus pertenencias',
              content: 'Aprende las mejores técnicas para embalar diferentes tipos de objetos, desde artículos frágiles hasta muebles grandes. Incluye recomendaciones sobre materiales de embalaje y métodos de protección específicos...',
              author: 'Carlos Rodríguez',
              date: new Date('2024-03-01'),
              category: this.categoryName,
              imageUrl: 'assets/images/packing-tips.jpg',
              readTime: '7 minutos',
              tags: ['Embalaje', 'Protección', 'Mudanza segura']
            },
            {
              id: '3',
              title: 'Mudanza internacional: Todo lo que necesitas saber',
              content: 'Una guía completa sobre los aspectos específicos de una mudanza internacional. Desde trámites legales hasta consideraciones culturales, cubrimos todos los aspectos importantes para hacer tu traslado internacional exitoso...',
              author: 'María García',
              date: new Date('2024-03-02'),
              category: this.categoryName,
              imageUrl: 'assets/images/international-moving.jpg',
              readTime: '10 minutos',
              tags: ['Internacional', 'Trámites', 'Mudanza']
            }
          ];
          break;

        case 'reformas':
          this.posts = [
            {
              id: '1',
              title: 'Planificación de reformas: Por dónde empezar',
              content: 'Una guía completa para planificar tu proyecto de reforma. Desde la evaluación inicial hasta la selección de contratistas, te ayudamos a organizar cada aspecto de tu renovación para garantizar el mejor resultado...',
              author: 'Miguel Torres',
              date: new Date('2024-03-03'),
              category: this.categoryName,
              imageUrl: 'assets/images/renovation-planning.jpg',
              readTime: '8 minutos',
              tags: ['Planificación', 'Reformas', 'Renovación']
            },
            {
              id: '2',
              title: 'Tendencias en diseño de interiores 2024',
              content: 'Descubre las últimas tendencias en diseño de interiores y cómo incorporarlas en tu próxima reforma. Desde colores y materiales hasta estilos y distribuciones, analizamos lo más actual en diseño de espacios...',
              author: 'Ana Martínez',
              date: new Date('2024-03-04'),
              category: this.categoryName,
              imageUrl: 'assets/images/interior-trends.jpg',
              readTime: '6 minutos',
              tags: ['Diseño', 'Tendencias', 'Interiores']
            },
            {
              id: '3',
              title: 'Reformas sostenibles: Materiales y técnicas eco-friendly',
              content: 'Aprende sobre opciones sostenibles para tu próxima reforma. Desde materiales reciclados hasta sistemas de eficiencia energética, exploramos cómo hacer tu renovación más respetuosa con el medio ambiente...',
              author: 'David López',
              date: new Date('2024-03-05'),
              category: this.categoryName,
              imageUrl: 'assets/images/sustainable-renovation.jpg',
              readTime: '7 minutos',
              tags: ['Sostenibilidad', 'Eco-friendly', 'Materiales']
            }
          ];
          break;

        case 'limpieza':
          this.posts = [
            {
              id: '1',
              title: 'Rutinas de limpieza eficientes para hogares ocupados',
              content: 'Descubre cómo mantener tu hogar limpio y ordenado incluso con un horario apretado. Incluye programaciones diarias, semanales y mensuales, además de consejos para optimizar el tiempo dedicado a la limpieza...',
              author: 'María García',
              date: new Date('2024-03-06'),
              category: this.categoryName,
              imageUrl: 'assets/images/cleaning-routines.jpg',
              readTime: '5 minutos',
              tags: ['Rutinas', 'Eficiencia', 'Limpieza']
            },
            {
              id: '2',
              title: 'Productos de limpieza naturales y efectivos',
              content: 'Aprende a crear y utilizar productos de limpieza naturales que son seguros para tu familia y el medio ambiente. Incluye recetas caseras y consejos sobre su uso efectivo en diferentes superficies...',
              author: 'Elena Ruiz',
              date: new Date('2024-03-07'),
              category: this.categoryName,
              imageUrl: 'assets/images/natural-cleaning.jpg',
              readTime: '6 minutos',
              tags: ['Natural', 'Eco-friendly', 'DIY']
            },
            {
              id: '3',
              title: 'Limpieza profunda: Guía por habitaciones',
              content: 'Una guía detallada para realizar una limpieza profunda en cada habitación de tu hogar. Incluye listas de verificación, técnicas específicas y consejos profesionales para obtener los mejores resultados...',
              author: 'Carlos Rodríguez',
              date: new Date('2024-03-08'),
              category: this.categoryName,
              imageUrl: 'assets/images/deep-cleaning.jpg',
              readTime: '8 minutos',
              tags: ['Limpieza profunda', 'Guía', 'Mantenimiento']
            }
          ];
          break;

        default:
          this.posts = [];
          break;
      }
    });
  }
} 