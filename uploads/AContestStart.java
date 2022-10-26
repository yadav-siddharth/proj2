import java.util.Scanner;

public class AContestStart {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int p = sc.nextInt(), c=0;


        for (int a = 1; a <= p; a++) {
            long n = sc.nextLong();
            long x = sc.nextLong();
            long t = sc.nextLong();

            long z = t/x;

            if(z>n){
                System.out.println((n*(n-1))/2);
            }

            else{
                System.out.println(n*z - (z*(z+1))/2);
            }
        }
    }
}
