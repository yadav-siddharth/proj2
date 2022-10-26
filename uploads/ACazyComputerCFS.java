import java.util.Scanner;

public class ACazyComputerCFS {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        int c = sc.nextInt();
        int[] a = new int[n];

        for (int i=0; i<n; i++)
            a[i] = sc.nextInt();

        int c2=0;

        for (int i=1; i<n; i++){
            if(a[i]-a[i-1]<=c)
                c2++;

            else
                c2=0;
        }

        System.out.println(c2+1);

    }
}
