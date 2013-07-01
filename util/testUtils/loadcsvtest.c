#include <stdio.h>
#include <stdlib.h>
 
#define ARRAYSIZE(x)  (sizeof(x)/sizeof(*(x)))
 
int main(void)
{
   const char filename[] = "file.csv";
   /*
    * Open the file.
    */
   FILE *file = fopen(filename, "r");
   if ( file )
   {
      int array[2][10];
      size_t i, j, k;
      char buffer[BUFSIZ], *ptr;
      /*
       * Read each line from the file.
       */
      for ( i = 0; fgets(buffer, sizeof buffer, file); ++i )
      {
         /*
          * Parse the comma-separated values from each line into 'array'.
          */
         for ( j = 0, ptr = buffer; j < ARRAYSIZE(*array); ++j, ++ptr )
         {
            array[i][j] = (int)strtol(ptr, &ptr, 10);
         }
      }
      fclose(file);
      /*
       * Print the data in 'array'.
       */
      for ( j = 0; j < i; ++j )
      {
         printf("array[%lu]: ", (long unsigned)j);
         for ( k = 0; k < ARRAYSIZE(*array); ++k )
         {
            printf("%4d ", array[j][k]);
         }
         putchar('\n');
      }
   }
   else /* fopen() returned NULL */
   {
      perror(filename);
   }
   return 0;
}
 
/* my output
array[0]:   10   23  444  -33   45   33   22  445   44   34 
array[1]:    1   23  444  -33   45   33   22  445   44   34 
array[2]: -120   23  444  -33   45   33   22  445   44   34 
array[3]:   10   23   44  -33   45   33   22  445    4   34 
array[4]:   10   23    4  -33   45   33   22  445   44   34 
array[5]:   10   23  -44  -33  145   33   22    4   44   34 
array[6]:   10   23  444  -33   45   33   22  445   44   34 
array[7]:   10   23  444  -33   45  233   22  445   44   34 
array[8]:   10   23  444  -33   45   33   22  -45   44   34 
array[9]:   10   23  444  -33   45  323   22  445   44   34 
*/